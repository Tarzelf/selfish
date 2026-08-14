"""Offline audio production for Selfish.

Everything expensive or clever happens here, in batch, on a machine we control —
never on the listener's phone. The app is left with one job: play a stereo file
well. That is what keeps the client trivial to maintain while the audio stays
ambitious.
"""

from .beds import drifting_soundscape, fade, room_tone
from .hrtf import KemarHrtf, Placement, render_binaural, render_binaural_path
from .master import (
    SPEAKER_TARGET,
    MasterTarget,
    encode_delivery,
    mix_bed,
    mono_compatibility_db,
    normalise,
    resample_to,
    to_speaker_safe,
    write_wav,
)
from .qc import QcReport, check_render, verify_transcript
from .voice_chain import VoicePreset, process_voice
from .voicing import VoicingReport, check_whisper, measure_unvoiced_ratio

__all__ = [
    "SPEAKER_TARGET",
    "KemarHrtf",
    "MasterTarget",
    "Placement",
    "QcReport",
    "VoicePreset",
    "VoicingReport",
    "check_render",
    "check_whisper",
    "drifting_soundscape",
    "measure_unvoiced_ratio",
    "encode_delivery",
    "fade",
    "mix_bed",
    "mono_compatibility_db",
    "normalise",
    "to_speaker_safe",
    "process_voice",
    "render_binaural",
    "render_binaural_path",
    "resample_to",
    "room_tone",
    "verify_transcript",
    "write_wav",
]
