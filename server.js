var express = require('express'),
    app = express(),
    request = require('request'),
    templateHomePage = require('jade').compileFile(__dirname + '/source/templates/homepage.jade'),
    templateDetailPage = require('jade').compileFile(__dirname + '/source/templates/detailpage.jade'),
    satelize = require('satelize');

app.use(express.static(__dirname + '/static'))                      // because we're using stylus, 
                                                                    //this is where .styl file is compiled to .css
app.set('view engine', 'ejs');



app.get('/', function (req, res, next) {

//    console.log("******** get / call");
    try {
        
        // grab user information (too much, just interested in ip)
        var user = {
            agent: req.headers['user-agent'], // User Agent we get from headers
            referrer: req.headers['referrer'], //  Likewise for referrer
            ip: req.headers['x-forwarded-for'] || 
                 req.connection.remoteAddress ||
                 req.socket.remoteAddress ||
                 req.connection.socket.remoteAddress, // Get IP - allow for proxy
            screen: { // Get screen info that we passed in url post data
              width: req.param('width'),
              height: req.param('height')
            }
          };
        
        // SAVE FOR DEBUG
                console.log("ip: " + user.ip);
        // on localhost you'll see 127.0.0.1 if you're using IPv4  
        // or ::1, ::ffff:127.0.0.1 if you're using IPv6 

        // at this point we have the ip, use it in a location service to get lat lng
        satelize.satelize({ip:'46.19.37.108'}, function(err, payload) {
            console.log ("satelize err: " + err);
            console.log ("satelize payload: " + JSON.stringify(payload));
            
         
            var myUrl = "http://mobile-test-api.influentialdev.com/stream?"                
                                             + "lat=" + payload.longitute + "&"
                                             + "lng=" + payload.latitute;

            console.log("** url: " + myUrl);
            console.log("** about to make http request to url specified stream");

            request({
                url: myUrl,
            }, function (err, response, body) {

                console.log("* callback for external api call");
                // <------------------ CallBack for consuming external api 
                //                          //   /stream
                //   returns list of Instagram Media Objects
                //   [{
                //     id
                //     image
                //          url
                //          width
                //          height
                //   }]
                // <----------------------------------------------------------

                if (err) {
                    console.log(err);
                    return;
                }


                // parse callback value 
                // Apply the jade template to each object and generate the html for each object
                // render Jade templated page.



                //            console.log("<---- Get response body: " + response.body);
                var html = templateHomePage({
                    tabTitle_fromNode: 'Moments',
                    headerTitle_fromNode: 'Moments Happening Near You',
                    instagramMediaObjects_fromNode: JSON.parse(response.body) // parse response into JSON 
                        // and apply it to the jade template
                })

                console.log("* end of callbackfddd fd");
                res.send(html);
    //            res.send(html);

                // DEBUG: render the json for the callback value
                //            res.send(response.body);
                //            console.log("<---- Get response statusCode: " + response.statusCode);
                //            console.log("<---- Get response body: " + response.body);
            });
        });
        
        

//        res.send(html)
    } catch (e) {
        next(e)
    }
})


// KEEP FOR NOW, but don't need this
app.get('/stream', function (req, res, next) {

    console.log("******** get /stream call");
    try {

        // SAVE - but not necessary for this project since we are going to use the client side geolocation
        // when using: http://localhost:3000/stream?lat=23.1&lng=199.2
        // this pulls in the query values
                var latInput = req.query.lat;
                var longInput = req.query.lng;
                console.log("-- latInput: " + latInput);
                console.log("-- longInput: " + longInput);


        var myUrl_TODO_BasicMockData = "http://mobile-test-api.influentialdev.com/stream?lat=20.1&lng=80";
        var myUrl_EmpireStateBuilding = "http://mobile-test-api.influentialdev.com/stream?lat=40.748817&lng=-73.985428";

        console.log("** about to make http request to url specified stream");

        request({
            url: myUrl_EmpireStateBuilding,
        }, function (err, response, body) {

            console.log("* callback for external api call");
            // <------------------ CallBack for consuming external api 
            //                          //   /stream
            //   returns list of Instagram Media Objects
            //   [{
            //     id
            //     image
            //          url
            //          width
            //          height
            //   }]
            // <----------------------------------------------------------

            if (err) {
                console.log(err);
                return;
            }


            // parse callback value 
            // Apply the jade template to each object and generate the html for each object
            // render Jade templated page.



            //            console.log("<---- Get response body: " + response.body);
            var html = templateListPage({
                tabTitle_fromNode: 'Moments Detail',
                headerTitle_fromNode: 'Details of the Moment',
                instagramMediaObjects_fromNode: JSON.parse(response.body) // parse response into JSON 
                    // and apply it to the jade template
            })
            
            console.log("* end of callback");
            res.send(html);
//            res.send(html);

            // DEBUG: render the json for the callback value
            //            res.send(response.body);
            //            console.log("<---- Get response statusCode: " + response.statusCode);
            //            console.log("<---- Get response body: " + response.body);
        });



    } catch (e) {
        next(e)
    }
})

app.get('/:id', function (req, res, next) {
    // get the parameter from 
    //      req.params.id

    console.log("******** get /:id call");

    try {

        // use params for when its something like http://localhost:3000/22

        var myExternalURL_getDetail = "http://mobile-test-api.influentialdev.com/stream/" + req.params.id;
        console.log("** about to make http request to url /:id");
        console.log("                                 :" + myExternalURL_getDetail);
        //
        request({
            url: myExternalURL_getDetail
        }, function (err, response, body) {
            //
            //            // <------------------ CallBack for consuming external api 
            //            //                          //   /stream
            //            //   returns Instagram Media Object Detail
            //            //   [{
            //            //     attribution
            //            //     tags
            //            //     location
            //            //          latitude
            //            //          namer
            //            //          longitude
            //            //          id
            //            //     comments
            //            //          count
            //            //          data 
            //            //            created_time
            //            //            text
            //            //            from
            //            //                username
            //            //                profile_picture
            //            //                id
            //            //                full_name
            //            //            id
            //            //     filter
            //            //     created_time
            //            //     link
            //            //     likes
            //            //        count
            //            //        data
            //            //            username
            //            //            profile_picture
            //            //            id
            //            //            full_name
            //            //     images
            //            //        low_resolution
            //            //            url
            //            //            width
            //            //            height
            //            //        thumbnail
            //            //            url
            //            //            width
            //            //            height
            //            //        standard_resolution
            //            //            url
            //            //            width
            //            //            height
            //            //     users_in_photo
            //            //     caption
            //            //     type
            //            //     id
            //            //     user
            //            //        username
            //            //        profile_picture
            //            //        id
            //            //        full_name


            //            //   }]
            //            // <----------------------------------------------------------
            //
            if (err) {
                console.log(err);
                return;
            }


            var html = templateDetailPage({
                tabTitle_fromNode: 'Moments Detail',
                headerTitle_fromNode: 'Details of the Moment',
                instagramMediaObjectDetail_fromNode: JSON.parse(response.body) // parse response into JSON 
                    // and apply it to the jade template
            })

            // DEBUG - make sure param/:id comes back
            //            res.send(req.params.id);

            res.send(html);
        });



    } catch (e) {
        next(e)
    }
})

app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port' + (process.env.PORT || 3000))
})
