// ==UserScript==
// @name            OpSmarter 5.0
// @namespace       Opsmarter
// @version         5.0
// @description     Adds opsmart links to useful places.
// @include         *://blackboard.my.salesforce.com/*
// @grant           GM_xmlhttpRequest
// ==/UserScript==

/*
        Notes:
        
*/
(function(){
        /* <div> that holds client's ID. This is turned into a link later in the script for OpSmart access. */
        var div_ClientID = document.getElementById('00N70000002jOAj_ileinner');
        
        var SILink = document.getElementById('bbCasedetail:j_id1:j_id3:j_id7');
        var clientName = document.getElementById('cas4_ileinner');       // Institution name
        var complex = false;       // Is client a Complex client?
        var sdm = false;           // Is client a SDM client?

        /*
               Primary request to grab Ajax data which describes client. We grab and parse the type here, which lets us know
               which kind of button to use and which kind of label to give it.
        */
        if(div_ClientID) {
                var clientID = document.getElementById('00N70000002jOAj_ileinner').innerHTML;
                var OpSmartLink = '<a href="https://opsmart.blackboard.com/tracksmart/client_details.php?client=' + clientID + '" target="_blank">' + clientID + ' [Opsmart]';
                var AjaxArray = new Array();
                var ClientTypeFromArray = new Array();
                div_ClientID.innerHTML = OpSmartLink + '<span class="btnCancel" style="margin: 0px 0px 6px 6px; padding-top:4px;">Checking...</span></a>';

                GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://opsmart.blackboard.com/tracksmart/client_details_client_info_ajax.php?clientid="+clientID,
                        onload: function(response) {
                                AjaxArray = response.responseText.split('<div id=SCType name=SCType class="Alabels">');
                                ClientTypeFromArray = String(AjaxArray[1]).split('</div>');
                                // The below may change as Complex/SDM becomes a single business unit
                                if (ClientTypeFromArray[0]=='Diamond'){
                                        complex = true;
                                }

                                if (ClientTypeFromArray[0]=='SDM'){
                                        sdm = true;
                                }
                                
                                // Decide which button type to use
                                if (complex || sdm) {
                                        div_ClientID.innerHTML = OpSmartLink + '<span class="btnImportant" style="margin: 0px 0px 6px 6px; padding-top:4px;">SDM CLIENT</span></a>';
                                }
                                /*else if (sdm) {
                                        div_ClientID.innerHTML = OpSmartLink + '<span class="btnImportant" style="margin: 0px 0px 6px 6px; padding-top:4px;">SDM COMPLEX CLIENT</span></a>';
                                } */
                                else {
                                        if(ClientTypeFromArray[0] == '--') {       // Possible Self-Hosted client
                                                div_ClientID.innerHTML = OpSmartLink + '</a><span style="margin: 0px 0px 6px 6px; padding-top:4px; border-style: solid; border-width: 1px; border-radius: 5px; padding: 3px; font-size: .85em; font-weight: bold; background-image: url(\'https://raw.githubusercontent.com/allenvanderlinde/opsmarter/master/sh.png\')">Possible Self-Hosted</span>';
                                        } else {       // Silver, Gold, Platinum client
                                               div_ClientID.innerHTML = OpSmartLink + '<span class="btnCancel" style="margin: 0px 0px 6px 6px; padding-top:4px;">' + String(ClientTypeFromArray[0]) + '</span></a>'; 
                                        }
                                }
                        }
                });
        }

        /*
               Build a convenient link to an attached known issue's JIRA page.
        */
        if(SILink) {
                var SINumber = document.getElementById('bbCasedetail:j_id1:j_id3:j_id7').innerHTML;
                var newSILink = '<a href="https://jira.pd.local/browse/' + SINumber + '"target="_blank">' + SINumber + ' [JIRA]';
                SILink.innerHTML = newSILink;
        }
        
        /*
               Note: Will be comparing these and other international clients to data in a remote location to remove limitation of hard-coding their names
        */
        
        /* EMEA Client List -
               currently hard-coded */
        if(clientName) {
                var div_ClientID_EMEA = document.getElementById('cas4_ileinner').innerHTML;
                var StringArray = new Array();
                /* We use an array here to store the split client name string to compare to the below hard-coded array. */
                var clientNameSplit = new Array();
                var EMEAClientList = ["Aarhus University", "Edge Hill University", "Hanzehogeschool Groningen", "Kingston University", "Leiden University", "Saxion", "Staffordshire University", "University of Bedfordshire", "University of Bradford", "University of Groningen", "University of Johannesburg", "University of Leicester", "University of Manchester", "Universiteit Twente", "University of Sheffield", "University of Westminster", "Utrecht University", "Vrije Universiteit Amsterdam", "University of the West of England", "BPP Services Ltd", "Spiru Haret University", "Glasgow Caledonian University", "King's College London", "University College Dublin - Belfield", "Regent's University London"];
                StringArray = div_ClientID_EMEA.split('>');
                clientNameSplit = String(StringArray[1]).split('<');
                
                if(EMEAClientList.indexOf(clientNameSplit[0]) > -1) {       // If the client name's is found in the EMEAClientList
                        var newClientLink = div_ClientID_EMEA + '<a target="_blank" href="http://wikicentral/display/MHINT/EMEA+Clients" <span class="btnImportant" style="color:red" style="margin: 0px 0px 6px 6px; padding-top:4px;">AMS Client</span></a>';
                        clientName.innerHTML = newClientLink;
                        
                }
        }
        
        /* Australian Client List -
               currently hard-coded */
        if(clientName) {
               var div_ClientID_AUS = document.getElementById('cas4_ileinner').innerHTML;
               var StringArray = new Array();
                /* We use an array here to store the split client name string to compare to the below hard-coded array. */
               var clientNameSplit = new Array();
               var AUSClientList = ["Charles Darwin University", "University of Western Sydney", "Swinburne University of Technology", "RMIT University Australia", "Southern Cross University", "Curtin University", "THINK Education Services Pty Ltd", "James Cook University", "Charles Sturt University", "INTI Universal Holdings Sdn Bhd", "University of Newcastle", "Griffith University"];
               StringArray = div_ClientID_AUS.split('>');
               clientNameSplit = String(StringArray[1]).split('<');

               if(AUSClientList.indexOf(clientNameSplit[0]) > -1) {
                      var newClientLink = div_ClientID_AUS + '<a target="_blank" href="http://wikicentral/display/MHINT/SYD+Clients" <span class="btnImportant" style="color:red" style="margin: 0px 0px 6px 6px; padding-top:4px;">SYD Client</span></a>';
                      clientName.innerHTML = newClientLink;
               }
        }
        
        /* Do Not Touch Client List -
               currently hard-coded */
        if(clientName) {
               var name4 = document.getElementById('cas4_ileinner').innerHTML;
               var array3 = new Array();
               var array4 = new Array();
                
               //place list of "do not touch" Clients in brackets
               var DNTClientList = ["Air Force Institute of Technology", "Arizona State University", "Baker College of Flint", "Bb University", "Behringer Harvard", "Bellevue University", "Best Deal Insurance", "Blackboard Coursesites End User Support", "Blackboard Learn For Salesforce", "Caesars Entertainment", "Charles Darwin University", "Charles Sturt University", "Curtin University", "Edge Hill University", "ERM Group Inc.", "Embry-Riddle Aeronautical University", "Endologix", "Fairfax County Public Schools", "George Mason University", "George Washington University", "INTI Universal Holdings Sdn Bhd", "Institute for Intergovernmental Research", "Ivy Tech Community College of Indiana", "James Cook University", "K12 Inc.", "Leiden University", "Living Social", "McGraw-Hill Companies", "McGraw-Hill Higher Education", "Ministerio de Defensa Nacional de Colombia", "Mississippi Virtual Community College", "Montgomery College ", "Nexius Solutions Inc.", "PRIMEDIA", "Philadelphia College of Osteopathic Medicine", "RMIT University Australia", "Servicio Nacional de Aprendizaje (SENA)", "ShoreTel Inc.", "South Orange County Community College District", "Southern Cross University", "Strayer University", "Swinburne University of Technology", "Tarrant County College District", "THINK Education Services Pty Ltd", "Ultimate Medical Academy", "University of Groningen", "University of Leicester", "University of Manchester", "Universiteit Twente", "University of Western Sydney", "University of Westminster", "Utrecht University", "Vrije Universiteit Amsterdam", "Watson Pharmaceuticals", "Wolters Kluwer"];
               array3 = name4.split('>');
               array4 = String(array3[1]).split('<');

               if(DNTClientList.indexOf(array4[0]) > -1){
                      var content4 = name4 + '<a target="_blank" href="http://wikicentral.bbbb.net/display/CSOI/CH+-+Tier+1+Production+Environment+List" <span class="btnImportant" style="color:red" style="margin: 0px 0px 6px 6px; padding-top:4px;">Do Not Touch</span></a>';
                      clientName.innerHTML = content4;
               }
        }
        
        /*
               Compare Primary Group and Initial Case Owner strings to decide whether to alert.
        */
        /* Rough copy. */
        var primaryGroup = document.getElementById('00N70000002jOBk_ileinner').innerHTML;
        var initialCaseOwner = document.getElementById('00N70000002jOBI_ileinner').innerHTML;
        //if(primaryGroup != initialCaseOwner) {
        if(primaryGroup == initialCaseOwner) {
                showPopUp();
        }
        
        /* CSS-styled alert. */
        function showPopUp() {
                var groups_alert = 'Check for correct/matching Primary Group.';
                var keywords_alert = 'Hello, world!';
                
                /* Create the new div element for the alert. */
                var div = document.createElement('div');
                // Set basic properties of the div
                div.style.position = 'absolute';
                div.style.width = '60%';
                div.style.height = '120px';
                div.style.top = '10px';
                div.style.transform = 'translateX(33%)';       // Center
                
                //div.style.backgroundColor = '#B3E4FD';
                div.style.backgroundImage = 'url(\'https://raw.githubusercontent.com/allenvanderlinde/opsmarter/master/opbg.png\')';
                div.style.borderStyle = 'solid';
                div.style.borderWidth = '1px';
                //div.style.borderColor = '#0070d2';
                div.style.borderColor = '#0159a4';
                
                div.style.borderStyle = 'solid';
                div.style.borderWidth = '1px';
                div.style.boxSizing = 'border-box';
                
                /* Text formatting. */
                div.style.textAlign = 'center';
                div.style.verticalAlign = 'middle';
                div.style.textJustify = 'center';
                div.style.fontFamily = 'arial,sans-serif';
                div.style.fontWeight = 'bold';
                div.style.fontSize = '12pt';
                div.style.letterSpacing = '-0.5px';
                div.style.color = 'white';

                // can style with CSS and concatenation here -->
                div.innerHTML = '<p style=\"position: relative; top: 30px\">' + groups_alert + '</p>';
                document.body.appendChild(div);       // Add the new alert div to the page
                
                /* Build secondary notification div. */    
                var div_b = document.createElement('div');
                div_b.style.position = 'absolute';
                div_b.style.width = '60%';
                div_b.style.height = '120px';
                div_b.style.top = '132px';
                div_b.style.transform = 'translateX(33%)';
                div_b.style.backgroundColor = '#3fa1f4';

                div_b.style.borderStyle = 'solid';
                div_b.style.borderWidth = '1px';
                div_b.style.borderColor = div_b.style.backgroundColor;
                div_b.style.boxSizing = 'border-box';

                div_b.style.fontFamily = div.style.fontFamily;
                div_b.style.fontSize = '10pt';
                div_b.style.color = 'white';
                
                /* Search for team/business unit specific keywords. */
                var caseDesc = document.getElementById('cas15_ileinner').innerHTML;
                
                var keywordsRegEx = /collaborate/i;
                var n = caseDesc.search(keywordsRegEx);
                if(n > 0)       // Occurrence of keyword found
                        window.alert('found questions');

                div_b.innerHTML = caseDesc;
                document.body.appendChild(div_b);
                
                /* Register functions to elements. */
                div_b.onclick = function() {
                        fade(div_b, 'out');
                }
                
                div.onclick = function() {
                        fade(div, 'out');
                }
        }
        
        /*
               Aesthetic DOM functions.
        */
        function fade(element, option) {
                var op;
                var timer;
                
                if(option == 'out') {
                        op = 1;
                        timer = setInterval(function() {
                                if(op <= 0.1) {
                                        clearInterval(timer);
                                        element.style.display = 'none';
                                }
                                element.style.opacity = op;
                                op -= op * 0.1;
                        }, 12);
                }
        }
        
        /* Grab elements by class code (for future use?) */
        /*
        var elements = document.getElementsByClassName('pageDescription');
        for(var i = 0; i < elements.length; ++i) {
                var item = elements[i];
                item.style.color = '#FF00FF';
        }
        */
})();