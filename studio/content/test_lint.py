"""Tests for the editorial gates.

The fixtures double as worked examples of the register the catalogue targets and
the registers it rejects, so they are written as real prose rather than as
keyword soup.
"""

from __future__ import annotations

import pytest

from studio.content.lint import ScriptLinter, Severity

# Sensual, character-led, emotionally framed: the register that Apple rates 18+
# and that the research identifies as the stronger literary target anyway.
GOOD_SCRIPT = """
You got here first, which never happens, and you have already decided not to
mention it.

I take the seat opposite yours and say nothing for a while. The rain has made
the windows useless. Someone behind the bar is stacking glasses badly.

"You look tired," I tell you.

"I am tired." You turn your cup a quarter turn, then another. "I didn't think
you'd come."

I let that sit, because it deserves to. Then I reach across and stop your hand
where it is, my fingers over yours, and I keep them there long enough that you
have to decide what it means.

You don't move your hand. That is the whole answer, and we both hear it.

"Tell me about your week," I say, and you laugh at me, properly, for the first
time tonight. So I ask again, and I mean it, and you start talking, and I watch
your mouth the entire time without any intention of hiding it.

When you notice, you stop mid-sentence. The bar carries on being a bar. I lean
in, close enough that you could stop me, and I wait there — not touching you,
just near — until your eyes drop closed on their own.

"Still tired?" I ask, very quietly.

"No," you say. "Not now."
"""

# Every cliché the measurement literature flags, at density.
SLOP_SCRIPT = """
Her heart hammered against her ribs as his voice, barely above a whisper,
sent a shiver down your spine.

His breath was hot against your ear, and time seemed to stand still. The world
melted away. Little did you know that heat was already pooling low, a delicious
ache, a sweet torture that made your knees go weak.

"Is this okay?" he growled, voice thick with desire, eyes never leaving yours.

Something flickered in his gaze. Your pulse quickened. Your breath catches in
your throat as electricity shot through every fiber of your being, inch by inch,
and you forgot how to breathe entirely.

It was not just want, but need. Not merely desire, but hunger.
"""

EXPLICIT_SCRIPT = """
He moved between her thighs and there was penetration, deep and repeated,
his penis hard against her vagina as he began thrusting into her.

She could feel her clitoris throbbing and she knew she would orgasm soon,
and when he began to ejaculate she was already cumming around his cock.
"""

BLOCKED_SCRIPT = """
She was a schoolgirl, only sixteen years old, when the story begins in her
high school uniform.
"""

STACCATO_SCRIPT = "\n\n".join(
    [
        "The room was quiet and the evening had settled into something soft and unhurried.",
        "You waited.",
        "He looked.",
        "Nothing moved.",
        "A breath.",
        "Then silence.",
        "You knew.",
        "He smiled.",
        "It was time.",
        "You nodded.",
    ]
)

REPETITIVE_SCRIPT = (
    "I want you to listen to my voice and let it settle over you completely. "
    "The evening is long and there is nowhere at all that either of us has to be. "
    "I want you to listen to my voice and let it settle over you completely. "
    "Outside the window the traffic has thinned to almost nothing now. "
)


@pytest.fixture(scope="module")
def linter() -> ScriptLinter:
    return ScriptLinter()


def test_good_script_passes_every_gate(linter: ScriptLinter) -> None:
    result = linter.lint(GOOD_SCRIPT, intensity=2)
    assert not result.blocked
    assert result.publishable, result.summary()
    # No clichés at all is the bar for a hand-checked exemplar.
    assert result.metrics["slop_hits"] == 0, result.summary()


def test_good_script_has_varied_rhythm(linter: ScriptLinter) -> None:
    result = linter.lint(GOOD_SCRIPT)
    assert result.metrics["sentence_length_stdev"] > 3.5


def test_lexical_diversity_is_reported_but_never_gated(linter: ScriptLinter) -> None:
    """Regression guard against anyone promoting this metric to a gate.

    Generic creative-writing benchmarks treat lexical diversity as a quality
    proxy. In this genre it is anti-correlated with quality: florid cliché scores
    well and deliberate plainness scores badly. Both facts are asserted here so
    the trap is documented in executable form.
    """
    good = linter.lint(GOOD_SCRIPT)
    slop = linter.lint(SLOP_SCRIPT)

    assert "lexical_diversity" in good.metrics
    assert slop.metrics["lexical_diversity"] > good.metrics["lexical_diversity"]

    for result in (good, slop):
        assert not any("diversity" in f.rule for f in result.findings)


def test_slop_script_fails_on_density(linter: ScriptLinter) -> None:
    result = linter.lint(SLOP_SCRIPT, intensity=2)
    assert not result.publishable
    assert result.metrics["slop_per_1000_words"] > 4.0
    rules = {f.rule for f in result.findings}
    assert "craft.cliche_density" in rules
    assert "craft.not_x_but_y" in rules


def test_explicit_script_fails_the_ceiling(linter: ScriptLinter) -> None:
    result = linter.lint(EXPLICIT_SCRIPT, intensity=3)
    assert not result.publishable, result.summary()
    assert any(f.rule == "ceiling.explicit_register" for f in result.findings)


def test_ceiling_is_stricter_at_lower_intensity(linter: ScriptLinter) -> None:
    mild = "She felt his erection against her hip and said nothing at all."
    at_tier_one = linter.lint(mild, intensity=1)
    at_tier_three = linter.lint(mild, intensity=3)
    assert any(
        f.rule == "ceiling.explicit_register" and f.severity is Severity.FAIL
        for f in at_tier_one.findings
    )
    assert all(
        f.severity is not Severity.FAIL
        for f in at_tier_three.findings
        if f.rule == "ceiling.explicit_register"
    )


def test_blocked_script_is_blocked_and_short_circuits(linter: ScriptLinter) -> None:
    result = linter.lint(BLOCKED_SCRIPT)
    assert result.blocked
    assert not result.publishable
    # A blocked script must not be given style feedback, only stopped.
    assert result.metrics == {}
    assert all(f.rule == "safety.prohibited_content" for f in result.findings)


def test_ambiguous_terms_escalate_rather_than_block(linter: ScriptLinter) -> None:
    text = "You are being such a good girl for me tonight, and you know it."
    result = linter.lint(text)
    assert not result.blocked
    assert result.needs_human
    assert any(f.rule == "safety.needs_context_review" for f in result.findings)


def test_consent_language_is_flagged_for_freshness_not_removed(linter: ScriptLinter) -> None:
    text = "I stop and look at you. Is this okay? I need to hear you say it."
    result = linter.lint(text)
    findings = [f for f in result.findings if f.rule == "craft.cliche"]
    assert findings, "stock consent phrasing should be flagged as a cliché to rewrite"
    assert all(f.severity is Severity.WARN for f in findings)
    assert not result.blocked


def test_staccato_collapse_detected(linter: ScriptLinter) -> None:
    result = linter.lint(STACCATO_SCRIPT)
    assert any(f.rule == "craft.staccato_collapse" for f in result.findings)


def test_verbatim_self_repetition_detected(linter: ScriptLinter) -> None:
    result = linter.lint(REPETITIVE_SCRIPT)
    assert any(f.rule == "craft.self_repetition" for f in result.findings)


def test_genre_vocabulary_is_not_banned(linter: ScriptLinter) -> None:
    """The product is whispering. Bare genre words must survive the linter."""
    text = (
        "I will whisper this once. Feel my breath on your neck, and the way your "
        "shoulders tremble when you finally let them drop. Your pulse is quick. "
        "Mine is quicker."
    )
    result = linter.lint(text)
    assert result.metrics["slop_hits"] == 0, result.summary()
    assert result.publishable


def test_linter_reports_line_numbers(linter: ScriptLinter) -> None:
    result = linter.lint(SLOP_SCRIPT)
    located = [f for f in result.findings if f.line is not None]
    assert located
    assert all(f.line >= 1 for f in located)
