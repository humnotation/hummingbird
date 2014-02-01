//
// MusicXML to VexFlow
// Humming Bird
// (C) Blake@LessonUp
//

// Welcome to the MXVF Humming Bird Translator

// Please be careful entering the URLs and numbers because
// it may cause strange errors in the script if the syntax is not correct


MXVF.inputParams = {
  
  // This only works in non-Chrome browsers, because origin null is not allowed by Access-Control-Allow-Origin
  urls: ["../../../resources/In%20The%20Hall%20of%20The%20Mountain%20King/in_the_hall_of_the_mountain_king.xml",
         "../../../resources/Marines%20Hymn/the_marines_hymn.xml",
         "../../../resources/O%20Christmas%20Tree/o_christmas_tree.xml",
         "../../../resources/The%20Tempest/the_tempest.xml"],
  // need to deploy with non minimized VF to debug better
  
  whichUrl: 1,  // 1, 2, 3, 4,...,N

  whichPage: 1  // 1, 2, ... (however many pages there may be)

      // Also there is an example output file or two for 'My Bonnie' but not input XML

};


/*
MXVF Known Issues

To change the input file or requested page number requires editing the parameter file

New font symbols need to be added and assigned

If there exists more than one <part> section in the input file then I ignore them ones past the first one

In the MusicXML Credit object, ignored the justification. Code from VexFlow/src/annotation.js  can be reused for this.

The OO style could be improved and made more consistent and useful

There should be some regression tests for easier diagnosis during development

*/


