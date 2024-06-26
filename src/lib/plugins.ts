import { $ } from "@oplayer/core"

/**
 *
 * @param options [op end time, ed start time]
 * @returns PlayerPlugin
 */
export const skipOpEd = () => ({
  name: "skip-op-ed-plugin",
  apply: (player: any) => {
    const pos = $.css(`
      display: none;
      position: absolute;
      bottom: 4em;
      right: 0px;
      margin-right: 1.5em;
      z-index: 1;`)

    const area = $.css(`
      color: hsl(224, 71.4%, 4.1%);
      background: hsl(0, 0%, 100%);
      padding: 0.2em 1.3em;
      border-radius: 4px;
      font-size: 1.3em;
      cursor: pointer;`)

    const $dom = $.create(`div.${pos}`, {}, `<div class=${area}>Skip</div>`)

    let durations: never[] | [any, any] = []

    $dom.onclick = function () {
      let [opDuration, edDuration] = durations

      if (
        opDuration?.length &&
        player.currentTime >= opDuration[0] &&
        player.currentTime <= opDuration[1]
      ) {
        player.seek(opDuration[1])
      }

      if (
        edDuration?.length &&
        player.currentTime >= edDuration[0] &&
        player.currentTime <= edDuration[1]
      ) {
        player.seek(edDuration[1])
      }
    }

    player.on(["timeupdate", "seeked"], () => {
      let [opDuration, edDuration] = durations

      let timeInRange = false
      if (
        (opDuration?.length &&
          player.currentTime >= opDuration[0] &&
          player.currentTime <= opDuration[1]) ||
        (edDuration?.length &&
          player.currentTime >= edDuration[0] &&
          player.currentTime <= edDuration[1])
      )
        timeInRange = true

      if (!timeInRange) $dom.style.display = "none"
      else $dom.style.display = "block"
    })

    player.on("opedchange", ({ payload }: any) => {
      durations = payload
    })

    player.on("videosourcechange", () => {
      durations = []
    })

    player.on("timechange", (t: any) => {
      console.log(t)
      console.log(player.currentTime)
    })

    player.on("ended", ({ payload }: any) => {})

    $.render($dom, player.$root)
  },
})
