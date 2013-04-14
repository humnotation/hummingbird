//
// MusicXML to VexFlow
// Humming Bird
// (C) Blake@LessonUp
//

// Welcome to the MXVF Humming Bird Translator

// Please be careful entering the URLs and numbers because
// it may cause strange errors in the script if the syntax is not correct


MXVF.inputParams = {
  
  urls: ["http://humdev.local/uploads/Merry1.xml",
         "http://humdev.local/uploads/CrazyTrain.xml",
         "http://humdev.local/uploads/Tempest.xml",
         "http://humdev.local/uploads/BeachBoys.xml",
         "http://humdev.local/uploads/Merry2.xml",
         "http://humdev.local/uploads/CrazyDots.xml"],
         //"http://humdev.local/uploads/Staccato.xml"], 
            // this one broke 0.40 version
            // need to deploy with non minimized VF to debug better
  
  whichUrl: 6,  // 1, 2, 3, 4,...,N

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


