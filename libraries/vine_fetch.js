//instagram_fetch.js
//Fetches and retursn an object containing instagram posts for a certain search term

//Import request framework

var request = require('request');
var util = require('util');


exports.fetch = function (input, callback)  {

    var postsArr = [];
    var min_tag_id = 0;
    var searchTerm = "";
    var error;
    if (input.searchTerm){
      var searchTermArray = input.searchTerm.split(" ");
        for (i=0; i < searchTermArray.length; i++){
          searchTerm = searchTerm + searchTermArray[i];
        }
    }

      var tempURL = 'https://api.vineapp.com/timelines/tags/' + searchTerm
        request.get({
          url: tempURL,
          json: true,
      },

      function(err, response, body) {
        var latestIDValue = 0;
        if (input.latestID > 0){
          latestIDValue = input.latestID;
        }
        if (err) {
          //return exits.error(err);
          error = err;
        }
        if (response.statusCode > 299 || response.statusCode < 200) {
          //return exits.error(response.statusCode);
          error = response;
        } else {
        //var postsArr = [];
        var d = new Date();
        var n = d.toISOString();
          //callback(response);
          if (body.data.records){
              for (var i in body.data.records) {
                if (body.data.records[i].postId > input.latestID || !input.latestID){
                  if (body.data.records[i].postId > latestIDValue){
                    latestIDValue = body.data.records[i].postId;
                  }
                  var postHasVideo = true;
                  var postHasImage = false;
                  var postImagePreviewURL = '';
                  var postImageURL = '';
                  var postVideoPreviewURL = '';
                  var postVideoURL = '';
                  postsArr.push({
                    postID: body.data.records[i].postId,
                    postText: body.data.records[i].description,
                    postStatus: 'new',
                    postDate: body.data.records[i].created,
                    postScheduleDate: '',
                    postUserImageURL: body.data.records[i].avatarUrl,
                    postUserRealName: body.data.records[i].username,
                    postUserName: body.data.records[i].username,
                    postUpdateUser: '',
                    postType: 'instagram',

                    postStatusDate: n,
                        
                    //postHasVideo: postHasVideo,
                    //postHasImage: true,
                    postImagePreviewURL: body.data.records[i].thumbnailUrl,
                    postImageURL: body.data.records[i].thumbnailUrl,
                    postVideoPreviewURL: body.data.records[i].videoLowURL,
                    postVideoURL: body.data.records[i].videoUrl
                  });
                }
            }
          } else {
            error = 'No Records Found';
          }
        var values = {}
        var returnArr = [];
        returnArr.push(postsArr);
        returnArr.push(values);
    }
    callback(error, returnArr);
  });
}
