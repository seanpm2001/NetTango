/*
 * NetTango
 * Copyright (c) 2020 Michael S. Horn, Uri Wilensky, and Corey Brady
 *
 * Northwestern University
 * 2120 Campus Drive
 * Evanston, IL 60613
 * http://tidal.northwestern.edu
 * http://ccl.northwestern.edu

 * This project was funded in part by the National Science Foundation.
 * Any opinions, findings and conclusions or recommendations expressed in this
 * material are those of the author(s) and do not necessarily reflect the views
 * of the National Science Foundation (NSF).
 */

part of NetTango;

//-------------------------------------------------------------------------
/// Represents an integer parameter
//-------------------------------------------------------------------------
class IntAttribute extends NumAttribute {

  String get type => "int";

  IntAttribute(Block block, int id) : super(block, id) { stepSize = 1; }

  IntAttribute.clone(Block block, IntAttribute source, bool isSlotBlock) : super.clone(block, source, isSlotBlock);

  Attribute clone(Block block, bool isSlotBlock) {
    return IntAttribute.clone(block, this, isSlotBlock);
  }

}
