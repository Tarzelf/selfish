"""Deterministic gates for generated scripts.

Three independent checks run before a draft ever reaches a human editor, let
alone a TTS engine:

1. **Safety** — content that must never be produced. Hard stop.
2. **Ceiling** — has the draft crossed from "erotic or sensual dialog" (which
   Apple rates 18+ and permits) into "explicit, detailed depictions" (which
   Apple classes as unpublishable at any frequency)? This gate is what keeps the
   catalogue distributable.
3. **Craft** — is the prose actually good, or is it the statistical average of
   every romance novel ever scraped?

The craft gate matters more here than in most genres, and for an
uncomfortable reason. Measurement of LLM creative writing finds that its most
over-represented phrases are whispers, trembling, shivers, hammering hearts and
hitching breath — which is, almost exactly, the natural vocabulary of intimate
audio. The overlap between "slop" and "our genre" is close to total. So the
central quality problem of this product is not that models refuse to write
this material; it is that they write it in the most clichéd way imaginable, and
that cliché is invisible to anyone who has not looked at the base rates.

Two design consequences follow, both counter-intuitive:

- **The banlist must never enter the prompt.** Instructing a model to avoid a
  phrase list has been measured to backfire, and logit-level banning causes
  outright quality collapse. Detection belongs after generation, paired with a
  targeted rewrite request naming the specific line.
- **We cannot ban the genre's own words.** "Whisper" is the product. Only
  clichéd *collocations* are flagged, never bare vocabulary a good writer needs.
"""

from __future__ import annotations

import re
from collections import Counter
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"

# Excluded when measuring content-word diversity. Second-person intimate
# narration leans hard on pronouns by design — "you", "I", "your" are the form
# itself — so counting them as vocabulary makes the measure meaningless.
FUNCTION_WORDS = frozenset(
    """a an the and or but if so as at by for in of on to with from that this it its
    is am are was were be been being do does did done have has had will would can
    could should i you your yours me my mine myself yourself he she they him her them
    his their we us our not no nor then than there here what when who whom how why
    which while into onto out up down over under about again just very too also more
    most some any all both each few other such only own same s t don now d ll m o re
    ve y ain aren couldn didn doesn hadn hasn haven isn ma mightn mustn needn shan
    shouldn wasn weren won wouldn""".split()
)


class Severity(str, Enum):
    """Ordered by how the studio must respond."""

    BLOCK = "block"  # never publish, never render; stop the pipeline
    REVIEW = "review"  # a human must look at this specific line
    FAIL = "fail"  # must be fixed before publication
    WARN = "warn"  # should be improved


@dataclass(frozen=True)
class Finding:
    rule: str
    severity: Severity
    message: str
    evidence: str = ""
    line: int | None = None

    def __str__(self) -> str:
        where = f" (line {self.line})" if self.line else ""
        ev = f' -- "{self.evidence}"' if self.evidence else ""
        return f"[{self.severity.value.upper()}] {self.rule}{where}: {self.message}{ev}"


@dataclass
class LintResult:
    findings: list[Finding] = field(default_factory=list)
    metrics: dict = field(default_factory=dict)

    @property
    def blocked(self) -> bool:
        return any(f.severity is Severity.BLOCK for f in self.findings)

    @property
    def publishable(self) -> bool:
        return not any(
            f.severity in (Severity.BLOCK, Severity.FAIL) for f in self.findings
        )

    @property
    def needs_human(self) -> bool:
        return any(f.severity is Severity.REVIEW for f in self.findings)

    def by_severity(self, severity: Severity) -> list[Finding]:
        return [f for f in self.findings if f.severity is severity]

    def summary(self) -> str:
        lines = []
        if self.blocked:
            lines.append("BLOCKED — must not be produced")
        elif not self.publishable:
            lines.append("NOT PUBLISHABLE — fix required")
        elif self.needs_human:
            lines.append("PASSES AUTOMATED GATES — human review required")
        else:
            lines.append("PASSES AUTOMATED GATES")

        for key, value in self.metrics.items():
            lines.append(f"  {key}: {value:.3f}" if isinstance(value, float) else f"  {key}: {value}")

        counts = Counter(f.severity for f in self.findings)
        if counts:
            lines.append(
                "  findings: "
                + ", ".join(f"{sev.value}={counts[sev]}" for sev in Severity if counts[sev])
            )
        for f in self.findings:
            lines.append(f"  {f}")
        return "\n".join(lines)


def _phrase_pattern(phrase: str) -> re.Pattern[str]:
    """Word-boundary match tolerant of internal whitespace and punctuation."""
    parts = [re.escape(tok) for tok in phrase.split()]
    return re.compile(r"\b" + r"[\s,\-]+".join(parts) + r"\b", re.IGNORECASE)


def _load_phrase_list(path: Path) -> list[str]:
    phrases = []
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if line and not line.startswith("#"):
            phrases.append(line)
    return phrases


def _load_sectioned_terms(path: Path) -> dict[str, list[str]]:
    sections: dict[str, list[str]] = {}
    pattern = re.compile(r"^\[(\w+)\]\s+(.*)$")
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        match = pattern.match(line)
        if match:
            sections.setdefault(match.group(1), []).append(match.group(2).strip())
    return sections


class ScriptLinter:
    """Loads term lists once and lints many scripts."""

    def __init__(self, data_dir: Path | None = None) -> None:
        data_dir = data_dir or DATA_DIR
        self.slop_phrases = _load_phrase_list(data_dir / "slop_phrases.txt")
        self._slop_patterns = [(p, _phrase_pattern(p)) for p in self.slop_phrases]

        sections = _load_sectioned_terms(data_dir / "compliance_terms.txt")
        self._compiled: dict[str, list[tuple[str, re.Pattern[str]]]] = {}
        for name, terms in sections.items():
            compiled = []
            for term in terms:
                if term.startswith("re:"):
                    compiled.append((term, re.compile(term[3:], re.IGNORECASE)))
                else:
                    compiled.append((term, _phrase_pattern(term)))
            self._compiled[name] = compiled

    # -- gate 1: safety -----------------------------------------------------

    def check_safety(self, text: str) -> list[Finding]:
        findings = []
        for term, pattern in self._compiled.get("blocked", []):
            for match in pattern.finditer(text):
                findings.append(
                    Finding(
                        rule="safety.prohibited_content",
                        severity=Severity.BLOCK,
                        message="matches a prohibited-content term; this script must not be produced",
                        evidence=_context(text, match),
                        line=_line_of(text, match.start()),
                    )
                )
        for term, pattern in self._compiled.get("review", []):
            match = pattern.search(text)
            if match:
                findings.append(
                    Finding(
                        rule="safety.needs_context_review",
                        severity=Severity.REVIEW,
                        message=f"'{term}' is legitimate in adult fiction but context decides; a human must confirm",
                        evidence=_context(text, match),
                        line=_line_of(text, match.start()),
                    )
                )
        return findings

    # -- gate 2: explicitness ceiling ---------------------------------------

    def check_ceiling(self, text: str, intensity: int = 2) -> list[Finding]:
        """Flag drafts that have crossed into the unpublishable register.

        `intensity` is the authored tier (1 sensual, 2 warm, 3 explicit-implied).
        Even tier 3 is capped below graphic description, so the gate applies at
        every tier — higher tiers simply tolerate more before failing.
        """
        hits: list[tuple[str, re.Match[str]]] = []
        for term, pattern in self._compiled.get("ceiling", []):
            for match in pattern.finditer(text):
                hits.append((term, match))

        if not hits:
            return []

        # A single clinical term in a 2,000-word script is a word choice to fix.
        # A dozen is a register, and registers do not get fixed by editing lines.
        allowance = {1: 0, 2: 1, 3: 3}.get(intensity, 1)
        severity = Severity.FAIL if len(hits) > allowance else Severity.WARN
        findings = [
            Finding(
                rule="ceiling.explicit_register",
                severity=severity,
                message=(
                    f"{len(hits)} graphic/anatomical term(s) at intensity tier {intensity} "
                    f"(allowance {allowance}). Apple permits 'erotic or sensual dialog' at 18+ "
                    "but classes explicit, detailed depictions as unpublishable"
                ),
                evidence=", ".join(sorted({term for term, _ in hits})[:8]),
                line=_line_of(text, hits[0][1].start()),
            )
        ]
        return findings

    # -- gate 3: craft ------------------------------------------------------

    def check_craft(self, text: str) -> tuple[list[Finding], dict]:
        findings: list[Finding] = []
        words = _words(text)
        content_words = [w for w in words if w not in FUNCTION_WORDS]
        window = max(50, min(500, len(words) // 2))
        metrics = {
            "word_count": len(words),
            # Reported for observability, deliberately NOT gated. See the note
            # on lexical diversity below.
            "lexical_diversity": _mattr(words, window=window),
            "content_word_diversity": _mattr(content_words, window=window),
            "mean_sentence_length": 0.0,
            "sentence_length_stdev": 0.0,
            "slop_hits": 0,
            "slop_per_1000_words": 0.0,
        }

        sentences = _sentences(text)
        if sentences:
            lengths = [len(_words(s)) for s in sentences]
            metrics["mean_sentence_length"] = sum(lengths) / len(lengths)
            metrics["sentence_length_stdev"] = _stdev(lengths)

        seen: list[tuple[str, re.Match[str]]] = []
        for phrase, pattern in self._slop_patterns:
            for match in pattern.finditer(text):
                seen.append((phrase, match))

        metrics["slop_hits"] = len(seen)
        if words:
            metrics["slop_per_1000_words"] = len(seen) / len(words) * 1000

        for phrase, match in seen:
            findings.append(
                Finding(
                    rule="craft.cliche",
                    severity=Severity.WARN,
                    message=f"clichéd collocation '{phrase}' — rewrite this line specifically",
                    evidence=_context(text, match),
                    line=_line_of(text, match.start()),
                )
            )

        # Density, not presence, is what makes a script read as machine-written.
        if metrics["slop_per_1000_words"] > 4.0:
            findings.append(
                Finding(
                    rule="craft.cliche_density",
                    severity=Severity.FAIL,
                    message=(
                        f"{metrics['slop_per_1000_words']:.1f} clichés per 1000 words exceeds 4.0; "
                        "this needs regeneration, not line edits"
                    ),
                )
            )

        for match in re.finditer(
            r"\bnot\s+(?:just\s+|only\s+|merely\s+)?[\w\s]{3,40}?,?\s+but\s+", text, re.IGNORECASE
        ):
            findings.append(
                Finding(
                    rule="craft.not_x_but_y",
                    severity=Severity.WARN,
                    message="'not X but Y' construction — a measured LLM tell, weighted heavily in slop scoring",
                    evidence=_context(text, match),
                    line=_line_of(text, match.start()),
                )
            )

        # NOTE ON LEXICAL DIVERSITY — deliberately not a gate.
        # Generic creative-writing benchmarks score it as a quality proxy. Measured
        # against this genre it is anti-correlated: our cliché-saturated fixture
        # scores 0.80 while a deliberately plain, restrained passage scores 0.68,
        # because slop is florid and good intimate writing repeats simple words on
        # purpose. Gating on it would systematically reward purple prose. The
        # numbers are recorded for observability and nothing more.

        # Long generations collapse into staccato one-line paragraphs. It is a
        # structural failure mode, and it is trivially detectable.
        paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
        if len(paragraphs) >= 8:
            tiny = sum(1 for p in paragraphs if len(_words(p)) <= 5)
            ratio = tiny / len(paragraphs)
            metrics["tiny_paragraph_ratio"] = ratio
            if ratio > 0.35:
                findings.append(
                    Finding(
                        rule="craft.staccato_collapse",
                        severity=Severity.FAIL,
                        message=(
                            f"{ratio:.0%} of paragraphs are 5 words or fewer; long-form generation "
                            "has degraded into fragments"
                        ),
                    )
                )

        repeated = _repeated_ngrams(words, n=6, min_count=2)
        if repeated:
            metrics["repeated_6grams"] = len(repeated)
            findings.append(
                Finding(
                    rule="craft.self_repetition",
                    severity=Severity.FAIL,
                    message=f"{len(repeated)} six-word sequence(s) repeat verbatim within the script",
                    evidence="; ".join(repeated[:3]),
                )
            )

        if sentences and metrics["sentence_length_stdev"] < 3.5 and len(sentences) >= 12:
            findings.append(
                Finding(
                    rule="craft.monotone_rhythm",
                    severity=Severity.WARN,
                    message=(
                        f"sentence-length spread of {metrics['sentence_length_stdev']:.1f} words is flat; "
                        "narration will feel metronomic when spoken"
                    ),
                )
            )

        return findings, metrics

    # -- everything ---------------------------------------------------------

    def lint(self, text: str, intensity: int = 2) -> LintResult:
        result = LintResult()
        result.findings.extend(self.check_safety(text))
        # A blocked script is not improved by style notes.
        if result.blocked:
            return result
        result.findings.extend(self.check_ceiling(text, intensity))
        craft_findings, metrics = self.check_craft(text)
        result.findings.extend(craft_findings)
        result.metrics = metrics
        return result


# -- helpers ---------------------------------------------------------------


def _words(text: str) -> list[str]:
    return re.findall(r"[a-z']+", text.lower())


def _sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    return [p for p in parts if _words(p)]


def _stdev(values: list[int]) -> float:
    if len(values) < 2:
        return 0.0
    mean = sum(values) / len(values)
    return (sum((v - mean) ** 2 for v in values) / (len(values) - 1)) ** 0.5


def _mattr(words: list[str], window: int = 500) -> float:
    """Moving-average type-token ratio: length-insensitive lexical diversity."""
    if not words:
        return 0.0
    if len(words) <= window:
        return len(set(words)) / len(words)
    ratios = []
    counts: Counter[str] = Counter(words[:window])
    ratios.append(len(counts) / window)
    for i in range(window, len(words)):
        outgoing = words[i - window]
        counts[outgoing] -= 1
        if counts[outgoing] == 0:
            del counts[outgoing]
        counts[words[i]] += 1
        ratios.append(len(counts) / window)
    return sum(ratios) / len(ratios)


def _repeated_ngrams(words: list[str], n: int = 6, min_count: int = 2) -> list[str]:
    if len(words) < n:
        return []
    grams = Counter(" ".join(words[i : i + n]) for i in range(len(words) - n + 1))
    return [g for g, c in grams.items() if c >= min_count]


def _line_of(text: str, index: int) -> int:
    return text.count("\n", 0, index) + 1


def _context(text: str, match: re.Match[str], width: int = 40) -> str:
    start = max(0, match.start() - width)
    end = min(len(text), match.end() + width)
    snippet = text[start:end].replace("\n", " ")
    return ("..." if start > 0 else "") + snippet.strip() + ("..." if end < len(text) else "")
