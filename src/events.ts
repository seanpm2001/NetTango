// NetTango Copyright (C) Michael S. Horn, Uri Wilensky, and Corey Brady. https://github.com/NetLogo/NetTango

import { AttributeTypes } from "./attribute-types"

type BlockInstanceEvent = {
  readonly type:        "block-instance-changed"
  readonly containerId: string
  readonly blockId:     number
  readonly instanceId:  number | null
}

type AttributeChangedEvent = {
  readonly type:           "attribute-changed"
  readonly containerId:    string
  readonly blockId:        number
  readonly instanceId:     number
  readonly attributeId:    number
  readonly attributeType:  AttributeTypes
  readonly isProperty:     boolean
  readonly value:          any
  readonly formattedValue: string
}

type MenuItemEvent = {
  readonly type:        "menu-item-clicked" | "menu-item-context-menu"
  readonly containerId: string
  readonly blockId:     number
  readonly x:           number
  readonly y:           number
}

type BlockDefinitionEvent = {
  readonly type:        "block-definition-moved"
  readonly containerId: string
  readonly blockId:     number
}

type BlockInstanceMenuEvent = {
  readonly type:        "block-instance-menu"
  readonly containerId: string
  readonly action:      string
  readonly codeTip:     string
  readonly x:           number
  readonly y:           number
}

type ProgramChangedEvent =
    MenuItemEvent
  | AttributeChangedEvent
  | BlockInstanceEvent
  | BlockDefinitionEvent
  | BlockInstanceMenuEvent

export {
  ProgramChangedEvent
, MenuItemEvent
, AttributeChangedEvent
, BlockInstanceEvent
, BlockDefinitionEvent
, BlockInstanceMenuEvent
}
