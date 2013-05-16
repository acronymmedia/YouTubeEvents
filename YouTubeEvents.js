/***
 *                                        |    |                                 |                  |                         
 * ,---.,---.,---.,---.,---.,   .,-.-.    |    |__/ ,---.,   .. . .,---.,---.,---|---,---..   .,---.|--- ,---.,-.-.,---.,---. 
 * ,---||    |    |   ||   ||   || | |    |    |  \ |---'|   || | ||   ||    |   |---|    |   |`---.|    |   || | ||---'|     
 * `---^`---'`    `---'`   '`---|` ' '    |    `   ``---'`---|`-'-'`---'`    `---'   `---'`---'`---'`---'`---'` ' '`---'`    o
 *                          `---'         |              `---'                                                                
 *                                        |    |                                                                              
 *                                        |    |__/ ,---.,---.. . .    ,   .,---..   .,---.,---.                              
 *                                        |    |  \ |   ||   || | |    |   ||   ||   ||    `---.                              
 *                                        |    `   ``   '`---'`-'-'    `---|`---'`---'`    `---'o                             
 *                                                                     `---'  
 * 
 * YouTube API | 2013.05.13
 * Philip Lawrence, Acronym
 * 
 * Easily track YouTube videos in various web analytic tools.
 * Read more here: http://www.acronym.com/
 */ 
(function(window) {
    var YouTubeVideoAPI = function()
    {
        /** 
         * Bindings
         * Holds all of the bindings that the user enables
         *
         * object
         *
         * @protected
         */
        var bindings = {};
        
        /** 
         * That
         * Its that. Just that.. (replacement for this within the methods)
         *
         * boolean
         *
         * @protected
         */
        var that = this;
        
        /** 
         * YouTube HTML Elements
         * 
         * Array
         * 
         * @protected
         */
        var youTubeElements = [];
        
        /** 
         * YouTube Player Objects
         * 
         * Array
         * 
         * @protected
         */
        var youTubePlayers = [];
        
        /** 
         * YouTube Video Settings / Data
         * 
         * Array
         * 
         * @protected
         */
        var youTubeVideoData = [];
        
        /** 
         * API Ready flag
         * 
         * Boolean
         * 
         * @protected
         */
        var _apiCalled = false;
        
        /** 
         * Enable / Disable Debugging
         * 
         * boolean
         */
        this.enableDebugging = false;
        
        /** 
         * Enable / Disable Milestones
         * 
         * boolean
         */
        this.enableMilestones = true;
        
        /** 
         * Milestone Percentage
         * How often should the milestones fire (every X% percentage)?
         * 
         * int
         */
        this.milestonePercentage = 25;
        
        /**
         * Version
         * The current version of this script
         * 
         * string
         */
        this.version = '1.0.0';
        
        // Initialize everything
        (function() {
            
            // Load in YouTube API
            var tag = document.createElement('script');
            tag.src = "//www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            
            // Find all of the iFrames
            youTubeElements = [];
            var iFrames = document.getElementsByTagName('iframe');
            for(var i=0,l=iFrames.length; i<l; i++)
            {        
                var src = iFrames[i].getAttribute('src');
                if( ! src ) continue;
                
                var matches = src.match(/(?:https?:)?\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/embed\/([^#&?\/]+)/i);
                if(matches && matches.length > 1)
                {
                    // We have a YouTube video!
                    var videoID = matches[1];
                    
                    // Set a data attribute for ease of use later
                    iFrames[i].setAttribute('data-video-id', videoID);
                    
                    if(!iFrames[i].getAttribute('id'))
                    {
                        // We need an element ID for YouTube API to work properly
                        // so... we'll force one. Otherwise, we won't touch it.
                        iFrames[i].setAttribute('id', videoID);
                    }
                    
                    youTubeElements.push(iFrames[i]);
                }
            }
            
            // Find out if the API ready function already exists
            if(window.onYouTubeIframeAPIReady)
            {
                // It does... we should try to extend it instead of just overwriting it
                // Mama always taught me to share
                (function () {
                    var onYouTubeIframeAPIReadyAdditional = window.onYouTubeIframeAPIReady;

                    window.onYouTubeIframeAPIReady = function ()
                    {
                        onYouTubeIframeAPIReadyAdditional.apply(this);
                        that.apiReady();
                    }
                })();
            }
            else
            {
                // It doesn't - creating a new function
                window.onYouTubeIframeAPIReady = function ( ) { that.apiReady(); }
            }
        })();
        
        /**
         * On API Ready
         * Setup any elements needed later
         *
         * @return void
         */
        this.apiReady = function( )
        {
            if(_apiCalled)
            {
                _debug('API Ready callback already called. Aborting');
                return;
            }
            
            _debug('API Ready callback called');
            
            // Clear out any previous calls
            youTubePlayers = [];
            
            // Create a new YouTube object for each iFrame we found
            for (var i=0,l=youTubeElements.length; i<l; i++)
            {
                // Setup the new YouTube object
                youTubePlayers.push(new YT.Player(youTubeElements[i].getAttribute('id'), {
                    events: {
                        'onStateChange': that.stateChange
                    }
                }));
                
                // Setup the default settings / data
                youTubeVideoData.push({
                    played:         false,
                    paused:         false,
                    finished:       false,
                    duration:       null,
                    milestones:     {},
                    lastMilestone:  null,
                    timerInterval:  null,
                    timerLocation:  null,
                    previousState:  null,
                    previousTime:   0,
                    currentState:   null,
                    currentTime:    0,
                    title:          youTubeElements[i].getAttribute('data-video-name') || youTubeElements[i].getAttribute('data-video-id')
                });
            }
            _apiCalled = true;
        }
        
        /**
         * Bind listener
         * Bind an event listener to a specific event with a callback
         * 
         * @param   string  eventName
         * @param   mixed   callback (can be function name or reference)
         *
         * @return  bool    success of binding
         */
        this.bind = function(eventName, callback)
        {
            if((typeof callback == 'string' && typeof window[callback] == 'function') || typeof callback == 'function')
            {
                _debug('binding ' + callback + ' to ' + eventName);
                if(!bindings[eventName])
                    bindings[eventName] = [];
                bindings[eventName].push(callback);
                return true;
            }
            else
            {
                _debug('unable to bind callback, invalid type');
                return null;
            }
        };
        
        /**
         * Dispatch Event
         * Dispatch an event with optional dataset
         * 
         * @param   string  eventName
         * @param   object  data
         *
         * @return void
         * @access private
         */
        var _dispatch = function(eventName, data)
        {
            _debug('dispatching ' + eventName + ' event');
            
            // Verify we have something to call on this event
            if(typeof bindings[eventName] == 'object' && bindings[eventName].length > 0)
            {
                // We do! Loop time.
                for(var i=0,l=bindings[eventName].length; i<l; i++)
                {
                    if(typeof bindings[eventName][i] == 'function' || (typeof bindings[eventName][i] == 'string' && typeof window[bindings[eventName][i]] == 'function'))
                    {
                        // Verify we pass some sort of object for them
                        if(typeof data != 'object')
                            data = {};
                        
                        try
                        {
                            // Check the type of callback they gave. A function name or reference?
                            if(typeof bindings[eventName][i] == 'string')
                                window[bindings[eventName][i]](data);
                            else
                                bindings[eventName][i](data);
                        }
                        catch(e)
                        {
                            // Houston, uhh, we have a problem
                            _debug('Could not use callback: ' + e.message);
                        }
                    }
                }
            }
        };
        
        /**
         * YouTube Video State Change
         * Callback function to handle each YouTube video's state changes
         * 
         * @param   object  YouTube event
         *
         * @return void
         */
        this.stateChange = function(event)
        {
            // Shortcuts to current video being tracked
            var arrayLocation = event.target.id - 1;
            var videoElement = youTubeElements[arrayLocation];
            var videoSettings = youTubeVideoData[arrayLocation];
            var videoPlayer = youTubePlayers[arrayLocation];
            var videoID = videoElement.getAttribute('data-video-id');
            
            // Setup current information
            videoSettings.currentState = event.data;
            videoSettings.currentTime = Math.ceil(videoPlayer.getCurrentTime());
            
            // Default data
            var data = {
                video: videoSettings,
                element: videoElement
            };
            
            switch(event.data)
            {
                // Video is loaded, but has not been played
                case YT.PlayerState.UNSTARTED:
                
                    // Get the duration (since it is now loaded)
                    videoSettings.duration = videoPlayer.getDuration();
                    
                    // Setup any milestones
                    if(that.enableMilestones)
                    {
                        var milestones = that.milestonePercentage;
                        
                        // Does this video want different milestones setup?
                        if(videoElement.getAttribute('data-video-milestones'))
                        {
                            milestones = videoElement.getAttribute('data-video-milestones');
                        }
                        milestones = parseInt(milestones);
                        
                        var howManyMilestonesToLoad = 100 / milestones;
                        for(var i=1;i<howManyMilestonesToLoad;i++)
                        {
                            videoSettings.milestones[i * milestones] = Math.ceil((videoSettings.duration / howManyMilestonesToLoad) * i);
                        }
                        
                        // NOTE: We don't count 100% as a milestone
                    }                    
                    
                    _debug('VIDEO LOADED ' + videoID);
                    _dispatch('load', data);
                    
                break;
                
                // Video has completed
                case YT.PlayerState.ENDED:
                    // Video Close
                    _debug('FINISHED AT ' + videoSettings.currentTime + ' ' + videoID);
                    _dispatch('complete', data);
                    videoSettings.currentTime = 0;
                    videoSettings.finished = true;
                    
                    // Disable the timer?
                    if(that.enableMilestones)
                    {
                        if(videoSettings.timerInterval !== null)
                        {
                            _debug('CLEARING MILESTONE TIMER');
                            clearInterval(videoSettings.timerInterval);
                            videoSettings.timerInterval = null;
                        }
                        
                        videoSettings.lastMilestone = null;
                    }
                break;
                
                // Video is buffering (ugh!)
                case YT.PlayerState.BUFFERING:
                    _debug('BUFFERING AT ' + videoSettings.currentTime + ' ' + videoID);
                    _dispatch('buffer', data);
                    
                    // Disable the timer?
                    if(that.enableMilestones && videoSettings.timerInterval !== null)
                    {
                        _debug('CLEARING MILESTONE TIMER');
                        clearInterval(videoSettings.timerInterval);
                        videoSettings.timerInterval = null;
                    }
                break;
                
                // Video is cued up in the playlist
                case YT.PlayerState.CUED:
                    _dispatch('cued', data);            
                break;
                
                // Video is paused
                case YT.PlayerState.PAUSED:
                    if(videoSettings.previousState == event.data)
                    {
                        // We seeked somewhere
                        _debug('SEEKED FROM ' + videoSettings.previousTime + ' TO ' + videoSettings.currentTime + ' ' + videoID);
                        _dispatch('seek', data);
                    }
                    else if(videoSettings.currentTime == videoSettings.duration)
                    {
                        // We finished the video, ignore
                    }
                    else
                    {
                        // We paused
                        _debug('PAUSED AT ' + videoSettings.currentTime + ' ' + videoID);
                        _dispatch('pause', data);
                    }
                    
                    // Disable the interval timer?
                    if(that.enableMilestones && videoSettings.timerInterval !== null)
                    {
                        _debug('CLEARING MILESTONE TIMER');
                        clearInterval(videoSettings.timerInterval);
                        videoSettings.timerInterval = null;
                    }
                break;
                
                // Video is playing (multiple types)
                case YT.PlayerState.PLAYING:
                    if(!videoSettings.played)
                    {
                        // First time played
                        videoSettings.played = true;
                        _debug('FIRST PLAY FOR ' + videoID);
                        _dispatch('initial', data);               
                        _dispatch('play', data);                    
                    }
                    else if(videoSettings.played && videoSettings.finished)
                    {
                        // Replayed
                        videoSettings.finished = false;
                        _debug('REPLAYING STARTING AT ' + videoSettings.currentTime + ' ' + videoID);
                        _dispatch('replay', data);      
                        _dispatch('play', data);            
                    }
                    else
                    {
                        // Normal play (after pause, etc.)
                        _debug('PLAY AT ' + videoSettings.currentTime + ' ' + videoID);
                        _dispatch('play', data);
                    }
                    
                    // (Re)enable the interval timer?
                    if(that.enableMilestones && videoSettings.timerInterval === null)
                    {
                        _debug('LOADING MILESTONE TIMER');
                        videoSettings.timerLocation = videoSettings.currentTime;
                        videoSettings.timerInterval = window.setInterval(_checkMilestone, 1000, data);
                        _checkMilestone(data);  // Load the first time
                    }
                    
                break;
                
                // What is this crap?!
                default:
                    _debug('uknown event ' + event.data);
                break;
            }
            
            // Update the last states & times for future use
            videoSettings.previousState = videoSettings.currentState;
            videoSettings.previousTime = videoSettings.currentTime;
        };
        
        /**
         * Check milestones
         * See if the current time should be throwing a milestone or not
         *
         * @param   object  data    The data object to pass to the dispatcher
         * @access private
         */
        var _checkMilestone = function(data)
        {
            var location = data.video.timerLocation;
            if(location > data.video.lastMilestone)
            {
                for(var milestone in data.video.milestones)
                {
                    if(!data.video.milestones.hasOwnProperty(milestone)) continue;
                    
                    // Do we have a milestone that is greater than the previous milestone, but not too far ahead?
                    if(data.video.milestones[milestone] > data.video.lastMilestone && location > data.video.milestones[milestone])
                    {
                        data.milestone = parseInt(milestone);
                        _dispatch('milestone', data);
                        data.video.lastMilestone = data.video.milestones[milestone];
                    }
                }
            }
            
            // Update the current time (+1 second)
            data.video.timerLocation++;
        }
        
        /** 
         * Debug
         * Sends a console message when enabled
         * 
         * @param   string  msg     The message to send
         * 
         * @return void
         */
        var _debug = function(msg)
        {
            if(that.enableDebugging && typeof console == 'object' && typeof console.log == 'function')
                console.log('YouTube Events API: ' + msg);
        }
    }

    // Generate the variable that accessible to the window
    window.YouTubeEvents = new YouTubeVideoAPI();
})(window || {});