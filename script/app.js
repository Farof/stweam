(function app_wrapper (exports) {
  
  JSON.oldStringify = JSON.stringify;
  JSON.stringify = function (obj) {
    return JSON.oldStringify(obj).replace('\\', '\\\\', 'g');
  };
  
  Twitter.includeTweets({"results":[{"from_user_id_str":"127332194","profile_image_url":"http://a2.twimg.com/profile_images/1010152527/bearskinrug_normal.jpg","created_at":"Sat, 05 Mar 2011 16:40:14 +0000","from_user":"yozomist","id_str":"44074751970394112","metadata":{"result_type":"recent"},"to_user_id":null,"text":"Hi Paris Hilton: Source: community.parishilton.com --- Saturday, March 05, 2011Hi Paris Hilton ... http://bit.ly/gvzg9t","id":44074751970394112,"from_user_id":127332194,"geo":null,"iso_language_code":"en","to_user_id_str":null,"source":"&lt;a href=&quot;http://twitterfeed.com&quot; rel=&quot;nofollow&quot;&gt;twitterfeed&lt;/a&gt;"},{"from_user_id_str":"127332194","profile_image_url":"http://a2.twimg.com/profile_images/1010152527/bearskinrug_normal.jpg","created_at":"Sat, 05 Mar 2011 16:40:14 +0000","from_user":"yozomist","id_str":"44074751966187520","metadata":{"result_type":"recent"},"to_user_id":null,"text":"Hi Paris Hilton: Source: community.parishilton.com --- Saturday, March 05, 2011Hi Paris Hilton ... http://bit.ly/gvzg9t","id":44074751966187520,"from_user_id":127332194,"geo":null,"iso_language_code":"en","to_user_id_str":null,"source":"&lt;a href=&quot;http://twitterfeed.com&quot; rel=&quot;nofollow&quot;&gt;twitterfeed&lt;/a&gt;"},{"from_user_id_str":"212367566","profile_image_url":"http://a2.twimg.com/profile_images/1259800864/HPIM2540_normal.JPG","created_at":"Sat, 05 Mar 2011 16:40:08 +0000","from_user":"Niriniah","id_str":"44074727819583488","metadata":{"result_type":"recent"},"to_user_id":null,"text":"RT @humourdedroite: Au fait, si y'a pas assez de taxis \u00e0 Paris c'est parce que Sarkozy flippe de ce mec tr\u00e8s estival : http://tinyurl.com/6xmny8o","id":44074727819583488,"from_user_id":212367566,"geo":null,"iso_language_code":"fr","to_user_id_str":null,"source":"&lt;a href=&quot;http://twitter.com/&quot;&gt;web&lt;/a&gt;"},{"from_user_id_str":"18749279","profile_image_url":"http://a0.twimg.com/profile_images/507460548/Twitter_Profile_Pic_II_normal.png","created_at":"Sat, 05 Mar 2011 16:40:07 +0000","from_user":"Nest_Seekers","id_str":"44074723138744320","metadata":{"result_type":"recent"},"to_user_id":null,"text":"Int' Real Estate Beautiful Castle in France For Sale - Near Paris - Ch\u00e2teau de Bussi\u00e8re -  Gre... http://bit.ly/fLPORj #realestate #news","id":44074723138744320,"from_user_id":18749279,"geo":null,"iso_language_code":"en","to_user_id_str":null,"source":"&lt;a href=&quot;http://twitterfeed.com&quot; rel=&quot;nofollow&quot;&gt;twitterfeed&lt;/a&gt;"},{"from_user_id_str":"81067455","profile_image_url":"http://a0.twimg.com/profile_images/543819077/Schermata_2009-11-25_a_21.06.35_normal.png","created_at":"Sat, 05 Mar 2011 16:40:05 +0000","from_user":"jobely","id_str":"44074715899375616","metadata":{"result_type":"recent"},"to_user_id":null,"text":"Looking for #job/#hiring in #Paris-#France? Look at http://hardclicker.com/6RiDAa #jobely","id":44074715899375616,"from_user_id":81067455,"geo":null,"iso_language_code":"en","to_user_id_str":null,"source":"&lt;a href=&quot;http://www.jobely.com/&quot; rel=&quot;nofollow&quot;&gt;Jobely.com Updater&lt;/a&gt;"},{"from_user_id_str":"240453845","profile_image_url":"http://a1.twimg.com/profile_images/1259998744/bayrak_2_normal.jpg","created_at":"Sat, 05 Mar 2011 16:40:04 +0000","from_user":"tum_turkiye","id_str":"44074709888925696","metadata":{"result_type":"recent"},"to_user_id":null,"text":"g\u00fcndem/ Atlezimde bronz madalya kazand\u0131k: Milli atlet Halil Akka\u015f, Fransa'n\u0131n ba\u015fkenti Paris'te d\u00fczenlenen 31. A... http://bit.ly/h2KXdx","id":44074709888925696,"from_user_id":240453845,"geo":null,"iso_language_code":"nl","to_user_id_str":null,"source":"&lt;a href=&quot;http://twitterfeed.com&quot; rel=&quot;nofollow&quot;&gt;twitterfeed&lt;/a&gt;"},{"from_user_id_str":"141562104","profile_image_url":"http://a3.twimg.com/profile_images/1157397373/fulyl_normal.jpg","created_at":"Sat, 05 Mar 2011 16:40:02 +0000","from_user":"NewsBySophie","id_str":"44074703098363904","metadata":{"result_type":"recent"},"to_user_id":null,"text":"Kathy Hilton: &quot;Thrilled&quot; if Paris Hilton and Cy Waits Wed http://bit.ly/gXd7Cb","id":44074703098363904,"from_user_id":141562104,"geo":null,"iso_language_code":"en","to_user_id_str":null,"source":"&lt;a href=&quot;http://www.hootsuite.com&quot; rel=&quot;nofollow&quot;&gt;HootSuite&lt;/a&gt;"},{"from_user_id_str":"138763379","profile_image_url":"http://a0.twimg.com/profile_images/1084646302/wdac_normal.jpg","created_at":"Sat, 05 Mar 2011 16:40:02 +0000","from_user":"WDACPLAYLIST","id_str":"44074701731004417","metadata":{"result_type":"recent"},"to_user_id":null,"text":"TWILA PARIS - ALLELUIA (SMALL SACRIFICE) Listen:http://tinyurl.com/28r4eac","id":44074701731004417,"from_user_id":138763379,"geo":null,"iso_language_code":"en","to_user_id_str":null,"source":"&lt;a href=&quot;http://www.liquidcompass.net&quot; rel=&quot;nofollow&quot;&gt;LiquidCompass.net&lt;/a&gt;"},{"from_user_id_str":"232955500","profile_image_url":"http://a3.twimg.com/profile_images/927610097/ucanlust4_normal.jpg","created_at":"Sat, 05 Mar 2011 16:40:00 +0000","from_user":"Viqyourbal","id_str":"44074695452143617","metadata":{"result_type":"recent"},"to_user_id":null,"text":"Running errands for Paris to prep her for her first Father/Daughter dance later tonight.","id":44074695452143617,"from_user_id":232955500,"geo":null,"iso_language_code":"en","to_user_id_str":null,"source":"&lt;a href=&quot;http://twitter.com/&quot; rel=&quot;nofollow&quot;&gt;Twitter for iPhone&lt;/a&gt;"},{"from_user_id_str":"69858244","profile_image_url":"http://a0.twimg.com/profile_images/457784603/P4050692_normal.JPG","created_at":"Sat, 05 Mar 2011 16:39:59 +0000","from_user":"SBayRantsnRaves","id_str":"44074690372841472","metadata":{"result_type":"recent"},"to_user_id":1971475,"text":"@cynderela its B. @ Paris for lunch &amp; then Aria. My M&amp;G is @ 9 so if u wanna stop by while I'm in line lemme know","id":44074690372841472,"from_user_id":69858244,"to_user":"Cynderela","geo":null,"iso_language_code":"en","to_user_id_str":"1971475","source":"&lt;a href=&quot;http://itunes.apple.com/app/twitter/id333903271?mt=8&quot; rel=&quot;nofollow&quot;&gt;Twitter for iPad&lt;/a&gt;"},{"from_user_id_str":"237614889","profile_image_url":"http://a2.twimg.com/profile_images/1260789773/DSCN2131_normal.JPG","created_at":"Sat, 05 Mar 2011 16:39:58 +0000","from_user":"Kumi_Nakamura","id_str":"44074685511630848","metadata":{"result_type":"recent"},"to_user_id":193856971,"text":"@Maaiyi Ch\u00e2lons-en-Champagne :P // Waaah a 15 minutes de Paris en train .. la chance ! XD","id":44074685511630848,"from_user_id":237614889,"to_user":"Maaiyi","geo":null,"iso_language_code":"fr","to_user_id_str":"193856971","source":"&lt;a href=&quot;http://twitter.com/&quot;&gt;web&lt;/a&gt;"},{"from_user_id_str":"36496727","profile_image_url":"http://a1.twimg.com/profile_images/191194792/catherine-twitter_normal.jpg","created_at":"Sat, 05 Mar 2011 16:39:58 +0000","from_user":"catinparis","id_str":"44074684525969408","metadata":{"result_type":"recent"},"to_user_id":null,"text":"Daytrip 2 Niort. Lovely sunny day. Saw market, castle and river, lunch with one friend and visited another one. Back 2 Paris in time 4 tea!","id":44074684525969408,"from_user_id":36496727,"geo":null,"iso_language_code":"en","to_user_id_str":null,"source":"&lt;a href=&quot;http://twitter.com/devices&quot; rel=&quot;nofollow&quot;&gt;txt&lt;/a&gt;"},{"from_user_id_str":"119955715","profile_image_url":"http://a0.twimg.com/profile_images/1216446249/762_-_C_pia_normal.JPG","created_at":"Sat, 05 Mar 2011 16:39:54 +0000","from_user":"laurafseleme","id_str":"44074668738621440","metadata":{"result_type":"recent"},"to_user_id":null,"text":"Daqui a pouco estarei indo para paris!! :D","id":44074668738621440,"from_user_id":119955715,"geo":null,"iso_language_code":"pt","to_user_id_str":null,"source":"&lt;a href=&quot;http://mobile.twitter.com&quot; rel=&quot;nofollow&quot;&gt;Mobile Web&lt;/a&gt;"},{"from_user_id_str":"124847852","profile_image_url":"http://a2.twimg.com/profile_images/1253273504/fbb78b57-fa62-4996-a658-e355a3d1a22b_normal.png","created_at":"Sat, 05 Mar 2011 16:39:51 +0000","from_user":"ampatenotte","id_str":"44074657669840896","metadata":{"result_type":"recent"},"to_user_id":null,"text":"C'est grave docteur?RT @jeanlucr: Le club de Football Paris Saint-Germain exclu de Facebook ? http://j.mp/fIAcCq","id":44074657669840896,"from_user_id":124847852,"geo":null,"iso_language_code":"fr","to_user_id_str":null,"source":"&lt;a href=&quot;http://www.tweetdeck.com&quot; rel=&quot;nofollow&quot;&gt;TweetDeck&lt;/a&gt;"},{"from_user_id_str":"178216944","profile_image_url":"http://a1.twimg.com/profile_images/1198764768/_DSC9641_normal.JPG","created_at":"Sat, 05 Mar 2011 16:39:47 +0000","from_user":"Tayroneeb","id_str":"44074638325719041","metadata":{"result_type":"recent"},"to_user_id":null,"text":"vooooooooooooooooltei \\o/ , acho que vou paris mais tarde ! kspoakopska","id":44074638325719041,"from_user_id":178216944,"geo":null,"iso_language_code":"pt","to_user_id_str":null,"source":"&lt;a href=&quot;http://twitter.com/&quot;&gt;web&lt;/a&gt;"}],"max_id":44074751970394112,"since_id":0,"refresh_url":"?since_id=44074751970394112&q=Paris","next_page":"?page=2&max_id=44074751970394112&q=Paris","results_per_page":15,"page":1,"completed_in":0.027102,"since_id_str":"0","max_id_str":"44074751970394112",
  "query":"Paris"}.results.map(function (tweet) {
    return Tweet.from({
      data: tweet
    });
  }));
  
  /*var input = TweetInput.add({
    type: 'global'
  });*/
  //var input = Twitter.deserialize('{"uid":"15","constructorName":"TweetInput","type":"global"}');
  
  /*var filter = TweetFilter.add({
    input: input.uid,
    param: 'from_user',
    operator: 'contains',
    value: 'y'
  });*/
  //var filter = Twitter.deserialize('{"uid":"16","constructorName":"TweetFilter","input":"15","param":"from_user","operator":"contains","value":"y"}');
  
  
  /*var output = TweetOutput.add({
    type: 'DOM',
    input: filter.uid,
    node: '#list'
  });*/
  //var output = Twitter.deserialize('{"uid":"17","constructorName":"TweetOutput","input":"15","type":"DOM","node":"#list"}');
  
  /*var process = Process.add({
    name: 'My first Process',
    items: [
      input,
      filter,
      output
    ]
  });*/
  var process = Twitter.deserialize('{"uid":"18","constructorName":"Process","name":"My first Process","items":["{\\"uid\\":\\"15\\",\\"constructorName\\":\\"TweetInput\\",\\"type\\":\\"global\\"}","{\\"uid\\":\\"16\\",\\"constructorName\\":\\"TweetFilter\\",\\"input\\":\\"15\\",\\"param\\":\\"from_user\\",\\"operator\\":\\"contains\\",\\"value\\":\\"y\\"}","{\\"uid\\":\\"17\\",\\"constructorName\\":\\"TweetOutput\\",\\"input\\":\\"15\\",\\"type\\":\\"DOM\\",\\"node\\":\\"#list\\"}"]}');
  
  process.generate().loadInWorkspace();
  
}(window));