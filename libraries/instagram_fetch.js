//instagram_fetch.js
//Fetches and retursn an object containing instagram posts for a certain search term

//Import request framework

var request = require('request');


exports.fetch = function (input, callback)  {

    var postsArr = [];
    var min_tag_id = 0;
    var i3 = 0;
    var searchTerm = "";
    if (input.searchTerm){
      console.log(input.searchTerm);
      var searchTermArray = input.searchTerm.split(" ");
        for (i=0; i < searchTermArray.length; i++){
          searchTerm = searchTerm + searchTermArray[i];
        }
    }

      var tempURL = 'https://api.instagram.com/v1/tags/' + searchTerm + '/media/recent?client_id=' + input.clientID;

      if (input.fetchCount) {
            tempURL = tempURL + '&count=' + input.fetchCount;
      }

      if (input.latestID) {
            tempURL = tempURL + '&min_tag_id=' + input.latestID;
      }

      console.log(tempURL);

        request.get({

        url: tempURL,

        json: true,

      },

      function(err, response, body) {

        if (err) {
          //return exits.error(err);
          callback(err);
        }
        if (response.statusCode > 299 || response.statusCode < 200) {
          //return exits.error(response.statusCode);
          callback('Error: ' + response.statusCode);
        } else {
        //var postsArr = [];
        var d = new Date();
        var n = d.toISOString();
          if (body.pagination.min_tag_id > input.latestID || !input.latestID ){
            for (var i in body.data) {

              var postHasVideo = false;
              var postHasImage = false;
              var postImagePreviewURL = '';
              var postImageURL = '';
              var postVideoPreviewURL = '';
              var postVideoURL = '';


              postsArr.push({
                postID: body.data[i].id,
                postText: body.data[i].caption.text,
                postStatus: 'new',
                postDate: body.data[i].created_time,
                postScheduleDate: '',
                postUserImageURL: body.data[i].user.profile_picture,
                postUserRealName: body.data[i].user.full_name,
                postUserName: body.data[i].user.username,
                postUpdateUser: '',
                postType: 'instagram',

                postStatusDate: n,
                    
                postHasVideo: postHasVideo,
                postHasImage: true,
                postImagePreviewURL: body.data[i].images.low_resolution.url,
                postImageURL: body.data[i].images.standard_resolution.url,
                postVideoPreviewURL: postVideoPreviewURL,
                postVideoURL: postVideoURL

              });
            }
          }
        var values = {}
        if (postsArr.length > 1){
          values.latestID = body.pagination.min_tag_id
        } else {
          values.latestID = input.latestID
        }
        var returnArr = [];
        returnArr.push(postsArr);
        returnArr.push(values);
        callback(returnArr);
    } 
  });
}
