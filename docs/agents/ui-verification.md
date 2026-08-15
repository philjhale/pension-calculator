# UI verification

Any change to the UI must be verified by actually running it and posting the result in the chat, not just by passing type checks/tests — confirm the change renders and behaves correctly before reporting the task as complete.

## Screenshot vs video

- **Simple visual changes** (styling, layout, copy) — post a screenshot.
- **Interactive features** (anything the user clicks, drags, types into, or otherwise operates) — post a short video showing the interaction actually working end to end.

## Capturing the video

- Make sure the relevant element is scrolled into view and stays in frame for the whole interaction, not just present somewhere in the page.
- Videos must be encoded so they play natively on an iPhone: H.264/AAC in an `.mp4` container, `yuv420p` pixel format. Convert with `ffmpeg` if the capture tool outputs something else (e.g. `.webm`).
