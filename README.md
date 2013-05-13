# YouTube Events

YouTube Events allows for developers to bind callbacks to iFramed YouTube videos. 
In the examples we'll show you how to bind simple console logging, however the code does 
not limit you to just that. You can bind any JavaScript you'd like!

## Installation of the library

If you don't have any YouTube videos on your site, you should probably add one or two now. 
When viewing a video on YouTube select the "Share" tab under the video, and select the 
"Embed" option. Make sure the "Use old embed code" is **not** selected. You should insert 
this code within your page.

#### Attach the JS API URL parameter

Now that you have a video on your site, you may need to do one modification to the URL 
within the iFrame. Attach `?enablejsapi=1` to the end of the URL in the iFrame, so that 
it looks like the following:
```HTML
// Before
<iframe width="560" height="315" src="http://www.youtube.com/embed/12345abcdef" allowfullscreen></iframe>

// After:
<iframe width="560" height="315" src="http://www.youtube.com/embed/12345abcdef?enablejsapi=1" allowfullscreen></iframe>
```

#### Include the YouTubeEvents.js file

Next, you should include the YouTubeEvents.js JavaScript file. You can find the latest 
version on our [GitHub page](https://github.com/acronymmedia/YouTubeEvents). This should 
be included on the same page as the YouTube videos you want to bind events to, as such:
```HTML
<script type="text/javascript" src="/path/to/YouTubeEvents.js"></script>
```

Once this is complete, you can skip down to the _Configuration_ or _Binding Events_ sections.

#### If you're already using the YouTube API

If you're already using the YouTube API, there are a few things to note. 

1. If the YouTubeEvents.js file is included after where you define `onYouTubeIframeAPIReady`, 
  we will attempt to overload the function to call our code as well. However, if you include 
  the file before you define `onYouTubeIframeAPIReady`, then you will overwrite the file. To 
  combat this, within the `onYouTubeIframeAPIReady` you should include a call to 
  `YouTubeEvents.apiReady()`. If you're unsure where the  `onYouTubeIframeAPIReady` is defined 
  in relations to the YouTubeEvents.js file, you can include the call to YouTubeEvents and 
  the code will only run it once.

1. The code looks for existing iFrames. If you're using the API to create the iFrames, 
  then you can call `YouTubeEvents.stateChange(state)` within YouTube's `onStateChange` 
  method. `onStateChange` will only allow 1 callback, so if you're already using a callback 
  be sure to include `YouTubeEvents.stateChange(state)` within it, making sure to pass the 
  `state` integer.


## Configuration

The following items are configurable via the `YouTubeEvents` variable:

1. `YouTubeEvents.enableDebugging` (Boolean): If set to true, console logging (in applicable 
  browsers) will occur for any method calls with extra debugging information. Defaults to false.

1. `YouTubeEvents.enableMilestones` (Boolean): Allows you to enable or disable milestone 
  triggers. Milestone triggers are events that fire when the visitor has viewed defined 
  percentages of the video. If this is not needed, it can be disabled to save some resources. 
  Defaults to true.

1. `YouTubeEvents.milestonePercentage` (Integer): Allows you to set how often the milestone 
  trigger should fire. For example, if you set it to 20, every 20% of the video that the user 
  viewed, a milestone event trigger. By default this is set to 25 (a milestone would trigger 
  after 25%, 50% and 75% of the video was played).

You can also enable certain items via adding data attributes to the iFrame itself:

1. `data-video-name` (string): Allows you to set a friendly name for the video. By default 
  the video ID is the video name. Ex: `data-video-name="My awesome video"`

1. `data-video-milestones` (integer): Similar to `YouTubeEvents.milestonePercentage`, this 
  attribute allows you to set different milestones on individual videos. `data-video-milestones="20"`

## Binding Events

Finally, the good stuff! 

### Events to bind to

There are numerous events you can bind to:

 * `load` - The video has finished loading and is ready to play
 * `initial` - The video has started playing for the first time. The "play" event fires alongside this one
 * `replay` - The video has started playing again after already completing. The "play" event fires along side this one
 * `play` - The video is now playing, after being in a different state
 * `pause` - The video is now paused, after previously playing
 * `complete` - The video is now complete (finished)
 * `milestone` - A milestone has been hit. Each milestone will only fire once during a video play
 * `cued` - The video is now cued up, ready to play next
 * `buffer` - The video is now buffering
 * `seek` - The user seeked to a new time within the video

### Binding

To bind your callback, call `YouTubeEvents.bind` passing the event you want to bind to 
and your callback as parameters:
```JavaScript
// Bind with an anonymous function
YouTubeEvents.bind('play', function(data) {
    console.log('Video is playing!');
});

// OR, pass an existing function
YouTubeEvents.bind('play', myFunc);

// OR, pass a function name
YouTubeEvents.bind('play', 'myFunc');
```

#### The data argument

You'll likely notice that the callback function has an argument of "data". This passes 
information about the video and the event that occured to your function for further use.

The `data` object consists of the following information:

  * `video` - Information about the video. Most notably:
    * `currentTime` - The current location within the video (in seconds)
    * `duration` - The length of the video (in seconds)
    * `previousState` - The previous state / event that was fired
    * `previousTime` - When the previous state / event was fired (in seconds)
    * `title` - The title of the video (if defined in the data attribute... 
      otherwise the YouTube video ID)
  * `element` - Reference to the iFrame itself (DOM object)
  * `milestone` - The milestone that was fired (e.g. if 25% of the video was viewed, this would be 25)

#### Examples

Below are some examples on various bindings:
```HTML
<iframe width="560" height="315" src="http://www.youtube.com/embed/HI0n0hGZeBk?enablejsapi=1" data-video-name="Whose line bloopers" allowfullscreen></iframe>
<script type="text/javascript" src="/path/to/YouTubeEvents.js"></script>
<script type="text/javascript">
// Load event
YouTubeEvents.bind('load', function(data) {                     // Binding via anon function
    console.log('Example 1: Video "' + data.video.title + '" has loaded!');
});

// Play event
YouTubeEvents.bind('play', function(data) {                     // Binding via anon function
    console.log('Example 2: "' + data.video.title + '" is now playing at ' + data.video.currentTime + ' seconds');
});

// Milestone event examples
var milestones = function(data) {
    console.log('Example 3: ' + data.milestone + '% of "' + data.video.title + '" has been viewed');
};
YouTubeEvents.bind('milestone', milestones);                    // Binding via reference

function anotherMilestones(data) {
    console.log('Example 4: ' + data.milestone + '% of "' + data.video.title + '" has been viewed');
};
YouTubeEvents.bind('milestone', anotherMilestones);             // Binding via reference

function oneLastMilestoneExample(data) {
    console.log('Example 5: ' + data.milestone + '% of "' + data.video.title + '" has been viewed');
};
YouTubeEvents.bind('milestone', 'oneLastMilestoneExample');     // Binding via function name
</script>
```
This would output in the browser's console:
```
Example 1: Video "Whose line bloopers" has loaded! 
Example 2: "Whose line bloopers" is now playing at 0 seconds 
Example 3: 25% of "Whose line bloopers" has been viewed
Example 4: 25% of "Whose line bloopers" has been viewed
Example 5: 25% of "Whose line bloopers" has been viewed
```

You can find more examples within the `/examples` directory.