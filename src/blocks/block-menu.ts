// NetTango Copyright (C) Michael S. Horn, Uri Wilensky, and Corey Brady. https://github.com/NetLogo/NetTango

import interact from "interactjs"
import { BlockDefinition, Grouping, MenuConfig } from "../types/types"
import { CodeWorkspaceUI } from "./code-workspace"
import { DragManager } from "./drag-drop/drag-manager"
import { createBlockInstanceEvent } from "./program-changed-event"
import { BlockDefinitionUI } from "./block-definition"
import { DropSpot } from "./baubles/drop-spot"
import { ArrayUtils } from "../utils/array-utils"
import { DomUtils } from "../utils/dom-utils"
import { EventRouter } from "../event-router"
import { BlockDefinitionEvent } from "../events"

class BlockMenuUI {

  private static readonly menuScrolls: Map<string, number> = new Map()

  readonly blocks: BlockDefinition[]
  readonly menuConfig: MenuConfig
  readonly containerId: string
  readonly workspace: CodeWorkspaceUI
  readonly enableDefinitionChanges: boolean
  readonly slots: BlockDefinitionUI[]

  color = "rgba(0, 0, 0, 0.2)"

  menuDiv = document.createElement("div")

  constructor(blocks: BlockDefinition[], menuConfig: MenuConfig, workspace: CodeWorkspaceUI, enableDefinitionChanges: boolean) {
    this.blocks = blocks
    this.menuConfig = menuConfig
    this.containerId = workspace.containerId
    this.workspace = workspace
    this.enableDefinitionChanges = enableDefinitionChanges
    this.slots = blocks.map( (b, i) => new BlockDefinitionUI(b, workspace, i) )
  }

  getBlockById(id: number): BlockDefinition {
    var matches = this.slots.filter( (s) => {
      return s.def.id === id
    })
    if (matches.length === 0) {
      throw new Error(`No block found for ID# ${id}`)
    }
    if (matches.length > 1) {
      throw new Error(`Multiple blocks found with ID# ${id}`)
    }
    return matches[0].def
  }

  draw(): HTMLDivElement {
    this.menuDiv = document.createElement("div")
    // this silliness and `resetScroll()` are a workaround to not get the menu scroll
    // to reset when working in the builder and adding, removing, and chaning blocks
    // that result in a total reload of all DIVs at the moment.  -Jeremy B August 2021
    this.menuDiv.addEventListener("scroll", (ev: Event) => {
      BlockMenuUI.menuScrolls.set(this.containerId, this.menuDiv.scrollTop)
    })
    this.menuDiv.className = ""

    this.menuDiv.id = `${this.containerId}-menu`
    this.menuDiv.classList.add("nt-menu")

    const checker = (d: boolean) => d && DragManager.isInSameWorkspace(this.containerId)
    const dropSpot = DropSpot.draw( () => DragManager.slotDrop(0), this.enableDefinitionChanges, checker)
    dropSpot.classList.add("nt-menu-slot-wrapper")
    this.menuDiv.append(dropSpot)

    const slotDropNotifier = (j: number) => {
      DragManager.slotDrop(j)
    }

    this.slots.forEach( (slot, i) => {
      this.menuDiv.append(slot.draw(i, slotDropNotifier, this.enableDefinitionChanges))
    })

    const dropZone = interact(this.menuDiv).dropzone({
      accept:  ".nt-menu-slot, .nt-block, .nt-cap, .nt-notch"
    , checker: (_1, _2, dropped) => this.workspace.checker(dropped)
    })

    dropZone.on("dragenter", () => {
      this.menuDiv.classList.add("nt-menu-drag-over")
    })
    dropZone.on("dragleave", () => {
      this.menuDiv.classList.remove("nt-menu-drag-over")
    })
    dropZone.on("drop", () => {
      this.drop()
    })

    this.updateLimits()

    return this.menuDiv
  }

  resetScroll(): void {
    if (BlockMenuUI.menuScrolls.has(this.containerId)) {
      this.menuDiv.scrollTop = BlockMenuUI.menuScrolls.get(this.containerId)!
    }
  }

  moveSlot(from: number, to: number): void {
    const block = this.blocks[from]
    if (this.slots[from].slotIndex !== from) {
      throw new Error(`Slot index incorrect for: ${from}`)
    }
    ArrayUtils.swap(this.blocks, from, to)
    ArrayUtils.swap(this.slots, from, to)
    this.slots.forEach( (slot, i) => slot.slotIndex = i )
    // The +1's are to skip the top-drop element.
    DomUtils.swapChildren(this.menuDiv, from + 1, to + 1)
    const event: BlockDefinitionEvent = {
      type: "block-definition-moved"
    , containerId: this.containerId
    , blockId: block.id
    }
    EventRouter.fireEvent(event)
  }

  updateLimits(): void {
    for (var slot of this.slots) {
      slot.updateForLimit()
    }
  }

  drop(): void {
    DragManager.drop( (oldBlocks) => {
      this.menuDiv.classList.remove("nt-menu-drag-over")
      const changedBlock = oldBlocks[0]
      EventRouter.fireEvent(createBlockInstanceEvent(changedBlock))
    })
  }

}

export { BlockMenuUI as BlockMenuUI }
