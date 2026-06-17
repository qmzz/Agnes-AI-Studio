# Changelog

## v1.2.0 - 2026-06-17

### Added

- Add clear actions for image history, video history, and video task logs.
- Add video task ID display and copy action.
- Add local-only smoke test tooling for development.
- Add Worker HTML text import rule for safer Cloudflare Worker deployment.

### Changed

- Reduce video polling frequency to 15 seconds for the first 120 seconds and 10 seconds after that.
- Improve video task URL extraction when completed query responses use nested or non-standard fields.
- Show a clear error when a completed video task does not include a video URL, including a compact response summary.
- Harden Worker proxy with same-origin checks, Agnes domain allowlist, and basic rate limiting.
- Keep test tooling local-only and remove it from the published repository.

## v1.1.0 - 2026-06-08

### Added

- Recover pending video tasks after page refresh.
- Preserve local generation history with localStorage quota fallback.
- Add history filters for image and video results.
- Add copy URL action for generated results.
- Add image result action to use it as an image-to-video reference.
- Show version number in the app header.
- Add local release check script.

### Changed

- Improve user-facing API error messages.

## v1.0.0 - 2026-06-08

### Added

- Image generation: text-to-image and image-to-image via public image URL.
- Video generation: text-to-video, image-to-video, multi-image reference, and keyframes.
- Frame rate/frame count linkage with `frames = fps * seconds + 1`.
- Local generation history for images and videos.
- Result actions: open, download, delete, and use image as reference.
- Dark/light theme toggle.
- Advanced API endpoint and model settings.
- README privacy notice and in-app privacy notice.
