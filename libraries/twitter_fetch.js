//twitter_fetch.js
//Fetches and retursn an object containing twitter posts for a certain search term

//Import twitter framework
var Twitter = require('twitter');
//var Twitter = require('../../node-modules/node-twitter/lib/twitter.js');
var OAuth2 = require('OAuth').OAuth2;
var https = require('https');
var util = require('util');


exports.fetch = function(input, callback) {
    var posts = []
    var client = new Twitter({
      consumer_key: input.consumer_key,
      consumer_secret: input.consumer_secret,
      bearer_token: input.bearer_token
    });

    var params = {q: input.searchTerm, count: input.fetchCount, since_id: input.latestID};
    console.log(params);
    client.get('/search/tweets', params, function(error, body, response){
      if (!error) {
      //var error = undefined;
      var returnArr = [];
      var postsArr = [];
      var valuesArr = [];
      var d = new Date();
      var n = d.toISOString();
      var latestIDValue = 0
      if (input.latestID > 0){
        var latestIDValue = input.latestID;
      }
      for (var i in body.statuses) {

            var postHasVideo = 'false';
            var postHasImage = 'false';
            var postImagePreviewURL = '';
            var postImageURL = '';
            var postVideoPreviewURL = '';
            var postVideoURL = '';

            if (body.statuses[i].id > input.latestID){
              since_id_return = body.statuses[i].id;
            }

            if (body.statuses[i].id > latestIDValue){
              latestIDValue = body.statuses[i].id;
            }

            if (body.statuses[i].entities.media) {
              console.log('Media');
              if (body.statuses[i].entities.media[0].type == 'photo') {
                  postHasImage = 'true';
                  postImagePreviewURL = body.statuses[i].entities.media[0].media_url + ':small';
                  postImageURL = body.statuses[i].entities.media[0].media_url;
              }

              if(body.statuses[i].entities.media[0].type == 'video') {
                  postHasVideo = 'true';
                  postHasImage = 'true';
                  postImagePreviewURL = body.statuses[i].entities.media[0].media_url + ':small';
                  postImageURL = body.statuses[i].entities.media[0].media_url;
                  postVideoPreviewURL = body.statuses[i].entities.media[0].variants[0].url;

                  for (var i2 in body.statuses[i].entities.media[0].variants[0]) {
                    if (body.statuses[i].entities.media[0].variants[i2].content_type == 'video\/mp4') {
                      postVideoURL = body.statuses[i].entities.media[0].variants[i2].url;
                    }
                  }

                }
              } else {
                console.log('No Media');
              }

            postsArr.push({
              postText: body.statuses[i].text,
              postID: body.statuses[i].id,
              postStatus: 'new',
              postDate: body.statuses[i].created_at,
              postScheduleDate: '',
              postUserImageURL: body.statuses[i].user.profile_image_url,
              postUserRealName: body.statuses[i].user.name,
              postUserName: body.statuses[i].user.screen_name,
              postUpdateUser: '',
              postType: 'twitter',

              postStatusDate: n,
              
              postHasVideo: postHasVideo,
              postHasImage: postHasImage,
              postImagePreviewURL: postImagePreviewURL,
              postImageURL: postImageURL,
              postVideoPreviewURL: postVideoPreviewURL,
              postVideoURL: postVideoURL
          });
          
       }
       values = {}
       values.latestID = latestIDValue
       returnArr.push(postsArr);
       returnArr.push(values);
       //callback(error, returnArr);
      } else {
        console.log(util.inspect(error, false, null));
        //var error_return = error;
      }
      callback(error, returnArr);
    });
}