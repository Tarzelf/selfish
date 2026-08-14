"""The content model, derived from evidence rather than from taste.

Every axis and priority here traces to a finding in `docs/research/`. The point
of encoding it as code instead of a document is that some of these rules are not
guidelines — they are constraints the pipeline must enforce mechanically, because
the cost of getting them wrong is either an undistributable app or a harmed user.

Three decisions drive the whole structure:

**Relational frame is the primary axis, not sexual act.** Experimental work found
that who the voice is *to the listener* predicts response better than physical
detail, that the established-partner and stranger frames both outperform the
"friend" frame, and that vague unplaced narrators perform worst of all. Platform
data agrees: the most-played category on the largest comparable service is
consistently the devoted-partner register, alternating with dominant-partner.
So the catalogue is organised by relationship, and every piece must place its
narrator explicitly.

**Intensity is a user-held dial with a hard ceiling.** Apple rates "erotic or
sensual dialog" at 18+ but classes "explicit, detailed depictions" as
undistributable at any frequency. Tier 3 is therefore capped below graphic
description. This is not only a compliance limit: the evidence indicates the
variable that matters is the *ratio of anticipation to explicitness*, not
explicitness itself, and that shame rises with explicitness for women more than
for men — so the ceiling and the quality target point the same way.

**Some content must never be reachable by accident.** Ravishment fantasy is
common (around 62% lifetime prevalence) but its valence is mixed — roughly 45%
find it wholly erotic, 46% both erotic and aversive, 9% wholly aversive — and a
large minority of users are survivors of sexual violence. Content like this is
built, and gated, and never surfaced by a recommender.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum


class Intensity(int, Enum):
    """Heat tiers. The user sets this and it persists; it is never an editorial default.

    The gap between TIER_3 and what the market's power users might want is a
    deliberate, permanent product limit on the App Store rail.
    """

    SENSUAL = 1  # tension, charge, no sexual activity depicted
    WARM = 2  # sexual activity clearly implied, described obliquely
    EXPLICIT_IMPLIED = 3  # unmistakable, still non-graphic; the hard ceiling

    @property
    def description(self) -> str:
        return {
            Intensity.SENSUAL: "Charged, restrained. Attention and anticipation only.",
            Intensity.WARM: "Sex is clearly happening. Described through feeling, not anatomy.",
            Intensity.EXPLICIT_IMPLIED: (
                "Unmistakable and direct, but never anatomically graphic. "
                "This is the App Store ceiling and cannot be raised."
            ),
        }[self]


class Frame(str, Enum):
    """Who the voice is to the listener. The primary organising axis."""

    DEVOTED_PARTNER = "devoted_partner"
    DOMINANT_PARTNER = "dominant_partner"
    LONGING_STRANGER = "longing_stranger"
    RIVAL = "rival"
    CARETAKER = "caretaker"
    FORBIDDEN_PROXIMITY = "forbidden_proximity"
    REUNION = "reunion"
    UNPLACED = "unplaced"  # permitted only in Focus; never in Desire

    @property
    def blurb(self) -> str:
        return {
            Frame.DEVOTED_PARTNER: "Someone who is unambiguously yours, and attentive.",
            Frame.DOMINANT_PARTNER: "Someone who takes charge, with your consent held throughout.",
            Frame.LONGING_STRANGER: "Someone who has just noticed you, and cannot stop.",
            Frame.RIVAL: "Someone who has irritated you for months.",
            Frame.CARETAKER: "Someone looking after you when you are worn through.",
            Frame.FORBIDDEN_PROXIMITY: "Someone you should not want, close by.",
            Frame.REUNION: "Someone who has been away too long.",
            Frame.UNPLACED: "A voice with no character attached.",
        }[self]


class Mood(str, Enum):
    """The entry point.

    The front door asks how you want to feel, not what you want to watch. This
    follows from two findings: that the honest answer to "what do you want?" at
    open time is often "I don't know yet", and that bed-at-night listening
    demands minimal decision load.
    """

    WORN_OUT = "worn_out"
    WANT_TO_BE_WANTED = "want_to_be_wanted"
    RESTLESS = "restless"
    CURIOUS = "curious"
    ALREADY_THERE = "already_there"
    NEED_TO_CONCENTRATE = "need_to_concentrate"
    CANNOT_SLEEP = "cannot_sleep"

    @property
    def prompt(self) -> str:
        return {
            Mood.WORN_OUT: "Worn out. Look after me.",
            Mood.WANT_TO_BE_WANTED: "I want to feel wanted.",
            Mood.RESTLESS: "Restless. Something with tension.",
            Mood.CURIOUS: "Curious. Surprise me.",
            Mood.ALREADY_THERE: "I know what I want.",
            Mood.NEED_TO_CONCENTRATE: "I need to concentrate.",
            Mood.CANNOT_SLEEP: "I can't sleep.",
        }[self]

    @property
    def is_express_route(self) -> bool:
        """Does this mood skip the warm-up ramp?

        The warm-up path is the default, not the only path. Responsive desire is
        common but it is one pattern among several — roughly equal proportions of
        women endorse linear and circular response models, and the circular model
        is over-represented among women with sexual difficulties. Forcing every
        user through a ramp would annoy those with spontaneous desire and imply
        something is wrong with them. So there is always a visible express route.
        """
        return self is Mood.ALREADY_THERE


class AsmrProfile(str, Enum):
    """How much mouth and breath detail is in the mix.

    Not a stylistic preference — a hard accessibility requirement. Misophonia is
    estimated at around a fifth of the population, and the single loudest ASMR
    complaint in competitor reviews is not dislike but distress: "it's a sensory
    nightmare... they need a trigger warning... Tag it." Meanwhile other users
    complain of the opposite, that recordings sound like "big, empty, white
    rooms". One baked mix cannot serve both, so every piece is rendered in more
    than one profile and the user chooses.
    """

    CLOSE = "close"  # full ASMR: breath, mouth detail, near-field
    SOFT = "soft"  # intimate but mouth sounds strongly reduced
    CLEAN = "clean"  # no mouth detail, minimal breath; for misophonia

    @property
    def default_for_new_users(self) -> bool:
        # SOFT is the default because it is the profile least likely to actively
        # distress someone who has not yet told us anything about themselves.
        return self is AsmrProfile.SOFT


class Gate(str, Enum):
    """Why a piece of content is not freely surfaceable."""

    NONE = "none"
    OPT_IN = "opt_in"  # user must explicitly enable the theme
    OPT_IN_NEVER_RECOMMENDED = "opt_in_never_recommended"


@dataclass(frozen=True)
class Trope:
    """A content theme, with the evidence for its priority attached.

    `priority` is launch order, 1 = build first. It is derived from the
    convergence of four independent sources: two fantasy-prevalence surveys, the
    largest fanfiction tag corpus, and the play data of the healthiest
    competitor. Where those sources disagreed, platform play data won, because
    it measures what people return to rather than what they will admit to.
    """

    key: str
    label: str
    priority: int
    frames: tuple[Frame, ...]
    max_intensity: Intensity = Intensity.EXPLICIT_IMPLIED
    gate: Gate = Gate.NONE
    warnings: tuple[str, ...] = ()
    evidence: str = ""

    @property
    def surfaceable_by_recommender(self) -> bool:
        return self.gate is not Gate.OPT_IN_NEVER_RECOMMENDED


# Ordered by launch priority. See docs/research/05 §3.5 for the ranking's basis.
TROPES: tuple[Trope, ...] = (
    Trope(
        key="devotion",
        label="Devotion",
        priority=1,
        frames=(Frame.DEVOTED_PARTNER, Frame.REUNION),
        evidence=(
            "The most-played category on the largest comparable platform, consistently. "
            "Also the top-rated item for women in Joyal's ranked survey, and the "
            "long-term-partner frame outperformed the friend frame experimentally."
        ),
    ),
    Trope(
        key="being_chosen",
        label="Being wanted",
        priority=1,
        frames=(Frame.DEVOTED_PARTNER, Frame.LONGING_STRANGER),
        evidence=(
            "Praise and body-worship categories rank among the most played. Directly "
            "counteracts the appearance self-consciousness that the literature "
            "identifies as a principal inhibitor of arousal in women."
        ),
    ),
    Trope(
        key="taken_care_of",
        label="Taken care of",
        priority=1,
        frames=(Frame.CARETAKER, Frame.DEVOTED_PARTNER),
        max_intensity=Intensity.WARM,
        evidence=(
            "Hurt/comfort is the single largest emotional tag in the fanfiction "
            "corpus by a wide margin (278,299 uses in a year, versus 110,596 for "
            "slow burn). Aftercare and apology are named top categories on Quinn. "
            "The gentlest content is also the most in demand."
        ),
    ),
    Trope(
        key="yearning",
        label="Yearning",
        priority=2,
        frames=(Frame.LONGING_STRANGER, Frame.FORBIDDEN_PROXIMITY, Frame.REUNION),
        max_intensity=Intensity.WARM,
        evidence=(
            "'Yearning' was among the most popular categories of the year on Quinn; "
            "Slow Burn is the second largest fanfiction tag. Anticipation, not "
            "explicitness, is the variable that matters."
        ),
    ),
    Trope(
        key="power_exchange",
        label="Being taken charge of",
        priority=2,
        frames=(Frame.DOMINANT_PARTNER,),
        gate=Gate.OPT_IN,
        warnings=("power exchange", "restraint"),
        evidence=(
            "Receptive dominance fantasy is reported by 93% (Lehmiller) and 64.6% "
            "(Joyal) of women, far exceeding the active pole. Alternates with the "
            "devoted-partner register for the top slot on Quinn. Gated because "
            "consent framing must be verified per item, not because demand is low."
        ),
    ),
    Trope(
        key="rivalry",
        label="Enemies to lovers",
        priority=2,
        frames=(Frame.RIVAL,),
        evidence=(
            "Quinn's single biggest original was enemies-to-lovers: 1.5M plays in "
            "week one, 39 million minutes listened. ~49k fanfiction tag uses a year "
            "and rising."
        ),
    ),
    Trope(
        key="forbidden",
        label="Shouldn't want this",
        priority=3,
        frames=(Frame.FORBIDDEN_PROXIMITY, Frame.RIVAL),
        warnings=("infidelity themes",),
        evidence=(
            "Lehmiller finds taboo a more common theme than passion/romance. "
            "Situational rather than paraphilic framings only: age gap, workplace, "
            "proximity. Never family, which the safety gate blocks outright."
        ),
    ),
    Trope(
        key="watched",
        label="Being watched",
        priority=3,
        frames=(Frame.LONGING_STRANGER, Frame.DOMINANT_PARTNER),
        gate=Gate.OPT_IN,
        warnings=("voyeurism", "public setting"),
        evidence="Voyeurism 48% and consensual exhibitionism/public settings 84% of women (Lehmiller).",
    ),
    Trope(
        key="ravishment",
        label="Overwhelmed",
        priority=4,
        frames=(Frame.DOMINANT_PARTNER, Frame.LONGING_STRANGER),
        gate=Gate.OPT_IN_NEVER_RECOMMENDED,
        warnings=("consensual non-consent", "power exchange", "intensity"),
        evidence=(
            "62% lifetime prevalence (Bivona & Critelli), but valence is mixed: 45% "
            "wholly erotic, 46% both erotic and aversive, 9% wholly aversive. 37% of "
            "women in Lehmiller's sample reported sexual victimisation. The operative "
            "mechanism is the fantasiser's control over the terms, so the design must "
            "preserve the listener's authorship and it must never arrive unrequested."
        ),
    ),
)

TROPES_BY_KEY = {t.key: t for t in TROPES}


@dataclass(frozen=True)
class FocusFormat:
    """The Focus room.

    Deliberately mostly wordless. The irrelevant-speech effect means continuous
    speech competes with focused cognitive work for the same resources, so a
    "whispered focus session" is an anti-feature. The voice belongs at the
    boundaries — settling in, coming back — and the middle is non-verbal.

    Focus is also the surface the App Store listing leads with, since metadata
    must suit a 4+ rating regardless of the app's own rating.
    """

    key: str
    label: str
    spoken_intro_sec: int
    spoken_outro_sec: int
    bed: str
    notes: str = ""


FOCUS_FORMATS: tuple[FocusFormat, ...] = (
    FocusFormat(
        key="deep_work",
        label="Deep work",
        spoken_intro_sec=75,
        spoken_outro_sec=45,
        bed="brown",
        notes="Broadband noise has the most credible attention evidence. No speech under the work.",
    ),
    FocusFormat(
        key="settle",
        label="Settle",
        spoken_intro_sec=180,
        spoken_outro_sec=0,
        bed="pink",
        notes="Longer spoken opening for people arriving agitated; fades to noise.",
    ),
    FocusFormat(
        key="sleep",
        label="Can't sleep",
        spoken_intro_sec=240,
        spoken_outro_sec=0,
        bed="brown",
        notes="Must end without a jolt: long fade, no closing cue, no autoplay.",
    ),
)


class TaxonomyError(ValueError):
    pass


def validate_placement(
    trope_key: str,
    frame: Frame,
    intensity: Intensity,
    surface: str,
) -> None:
    """Enforce the rules that must never be violated by a content record.

    `surface` is where the item would appear: "browse", "recommended",
    "autoplay", "opt_in_collection", or "focus".
    """
    trope = TROPES_BY_KEY.get(trope_key)
    if trope is None:
        raise TaxonomyError(f"unknown trope {trope_key!r}")

    # Checked before frame membership: UNPLACED belongs to no Desire trope, so the
    # membership error would otherwise mask the actual rule being broken.
    if frame is Frame.UNPLACED and surface != "focus":
        raise TaxonomyError(
            "unplaced narrators are permitted only in Focus; Desire content must "
            "place its narrator, since vague narrators measure worst of all frames"
        )

    if frame not in trope.frames:
        raise TaxonomyError(
            f"frame {frame.value!r} is not a valid frame for trope {trope_key!r}"
        )

    if intensity > trope.max_intensity:
        raise TaxonomyError(
            f"intensity {intensity.name} exceeds the cap {trope.max_intensity.name} "
            f"for trope {trope_key!r}"
        )

    if trope.gate is Gate.OPT_IN_NEVER_RECOMMENDED and surface in {
        "recommended",
        "autoplay",
        "browse",
    }:
        raise TaxonomyError(
            f"trope {trope_key!r} must never appear in {surface!r}: it may only be "
            "reached from a collection the user has explicitly opted into"
        )

    if trope.gate is Gate.OPT_IN and surface == "autoplay":
        raise TaxonomyError(
            f"trope {trope_key!r} requires opt-in and must not autoplay"
        )

    if trope.warnings and surface == "autoplay":
        raise TaxonomyError(
            f"trope {trope_key!r} carries content warnings {trope.warnings} and must "
            "not be reached without the user seeing them"
        )


def launch_catalogue_plan(episodes_per_trope: int = 8) -> dict[int, list[str]]:
    """Which tropes to build in which wave, and roughly how many pieces.

    Priority 1 first, and note what that means: the opening catalogue is
    devotion, being wanted, and being taken care of. The gentlest material in the
    product is also the best evidenced. Ravishment, despite high prevalence,
    lands in the final wave because it needs the consent-framing standard and the
    opt-in machinery finished first.
    """
    waves: dict[int, list[str]] = {}
    for trope in sorted(TROPES, key=lambda t: t.priority):
        waves.setdefault(trope.priority, []).append(
            f"{trope.key} x{episodes_per_trope}"
        )
    return waves
