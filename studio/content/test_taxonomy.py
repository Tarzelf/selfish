"""Tests for the content model's non-negotiable rules.

These are safety and distribution invariants, so they are asserted rather than
documented. The ravishment tests in particular exist because the failure mode —
sensitive content reaching someone who did not ask for it — is a real harm to a
real person, and roughly a third of this audience are survivors of sexual
violence.
"""

from __future__ import annotations

import pytest

from studio.content.taxonomy import (
    FOCUS_FORMATS,
    TROPES,
    TROPES_BY_KEY,
    AsmrProfile,
    Frame,
    Gate,
    Intensity,
    Mood,
    TaxonomyError,
    launch_catalogue_plan,
    validate_placement,
)


def test_intensity_ceiling_is_three() -> None:
    """The App Store ceiling is a permanent product limit, not a default."""
    assert max(Intensity) is Intensity.EXPLICIT_IMPLIED
    assert Intensity.EXPLICIT_IMPLIED.value == 3
    assert "never anatomically graphic" in Intensity.EXPLICIT_IMPLIED.description


def test_every_trope_has_evidence() -> None:
    for trope in TROPES:
        assert trope.evidence.strip(), f"{trope.key} has no evidence recorded"
        assert trope.frames, f"{trope.key} has no relational frame"


def test_ravishment_can_never_be_surfaced_automatically() -> None:
    for surface in ("browse", "recommended", "autoplay"):
        with pytest.raises(TaxonomyError, match="must never appear"):
            validate_placement(
                "ravishment", Frame.DOMINANT_PARTNER, Intensity.WARM, surface
            )


def test_ravishment_is_reachable_when_explicitly_chosen() -> None:
    validate_placement(
        "ravishment", Frame.DOMINANT_PARTNER, Intensity.WARM, "opt_in_collection"
    )


def test_ravishment_is_not_recommender_surfaceable() -> None:
    assert not TROPES_BY_KEY["ravishment"].surfaceable_by_recommender
    assert TROPES_BY_KEY["devotion"].surfaceable_by_recommender


def test_content_with_warnings_never_autoplays() -> None:
    warned = [t for t in TROPES if t.warnings]
    assert warned, "expected some tropes to carry warnings"
    for trope in warned:
        with pytest.raises(TaxonomyError):
            validate_placement(
                trope.key, trope.frames[0], Intensity.SENSUAL, "autoplay"
            )


def test_unplaced_narrator_is_confined_to_focus() -> None:
    with pytest.raises(TaxonomyError, match="only in Focus"):
        validate_placement("devotion", Frame.UNPLACED, Intensity.SENSUAL, "browse")


def test_intensity_cap_is_enforced_per_trope() -> None:
    # "Taken care of" is capped below the global ceiling on purpose.
    assert TROPES_BY_KEY["taken_care_of"].max_intensity is Intensity.WARM
    with pytest.raises(TaxonomyError, match="exceeds the cap"):
        validate_placement(
            "taken_care_of", Frame.CARETAKER, Intensity.EXPLICIT_IMPLIED, "browse"
        )


def test_frame_must_belong_to_trope() -> None:
    with pytest.raises(TaxonomyError, match="not a valid frame"):
        validate_placement("rivalry", Frame.CARETAKER, Intensity.WARM, "browse")


def test_gentle_tropes_lead_the_launch() -> None:
    """The best-evidenced content is the gentlest, and should ship first."""
    plan = launch_catalogue_plan()
    first_wave = " ".join(plan[1])
    assert "taken_care_of" in first_wave
    assert "devotion" in first_wave
    assert "being_chosen" in first_wave
    # Ravishment needs the opt-in machinery finished first.
    assert any("ravishment" in item for item in plan[max(plan)])


def test_there_is_always_an_express_route() -> None:
    """Warm-up is the default path, never the only path."""
    express = [m for m in Mood if m.is_express_route]
    assert len(express) == 1
    assert express[0] is Mood.ALREADY_THERE


def test_asmr_default_is_the_least_distressing_profile() -> None:
    defaults = [p for p in AsmrProfile if p.default_for_new_users]
    assert defaults == [AsmrProfile.SOFT]
    # A clean profile must exist for listeners with misophonia.
    assert AsmrProfile.CLEAN in set(AsmrProfile)


def test_focus_formats_are_mostly_wordless() -> None:
    """Speech competes with focused work, so the voice stays at the boundaries."""
    deep_work = next(f for f in FOCUS_FORMATS if f.key == "deep_work")
    assert deep_work.spoken_intro_sec <= 90
    assert "No speech under the work" in deep_work.notes


def test_sleep_format_does_not_end_abruptly() -> None:
    sleep = next(f for f in FOCUS_FORMATS if f.key == "sleep")
    assert sleep.spoken_outro_sec == 0
    assert "no autoplay" in sleep.notes


def test_opt_in_gating_is_declared_not_implied() -> None:
    gated = {t.key for t in TROPES if t.gate is not Gate.NONE}
    assert {"power_exchange", "watched", "ravishment"} <= gated
