var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function (req, res, next) {
   res.render('index');
});
router.get('/locations/search', function(req, res, next) {
    var lat = req.query.lat;
    var lng = req.query.lng;
    var access_token = req.query.access_token;
    var options = {
        url: 'https://api.instagram.com/v1/locations/search?lat=' + lat + '&lng=' + lng + '&access_token=' + access_token,
        method: 'get',
    }
    var data;

    request(options, function (err, response, body) {
        data = JSON.parse(body);
        if(!err)
            res.json(data);
        else
            console.log(err);
    });
});

router.get('/media/search', function(req, res, next) {
    var rec_per_page = 8;
    var lat = req.query.lat;
    var lng = req.query.lng;
    // lng= 2.294351;
    // lat = 48.858844;
    var curPage = req.query.page ? req.query.page:1;
    var offset = (curPage - 1) * rec_per_page;
    var list = [];
    var access_token = req.query.access_token;
    var options = {
        url: 'https://api.instagram.com/v1/media/search?lat=' + lat + '&lng=' + lng + '&access_token=' + access_token,
        method: 'get',
    }
    request(options, function (err, response, body) {
        rs = JSON.parse(body);
        if(!err)
        {
            for(var i = offset; i < rs.data.length; i++)
            {
                list.push(rs.data[i]);
                if(i >= rec_per_page + offset - 1)
                    break;
            }
            var data = {
                total: rs.data.length,
                list: list,
            }
            var number_of_pages = data.total / rec_per_page;
            if (data.total % rec_per_page > 0) {
                number_of_pages++;
            }

            var pages = [];
            for (var i = 1; i <= number_of_pages; i++) {
                pages.push({
                    pageValue: i,
                    isActive: i == curPage
                });
            }
            var output = {
                lat: lat,
                lng: lng,
                data: data,
                pages: pages,
                curPage: curPage,
                prevPage: curPage - 1,
                nextPage: curPage - (-1),
                showPrevPage: curPage > 1,
                showNextPage: curPage != pages.length,
            };
            res.json(output);
        }
        else
            console.log(err);
    });
});

module.exports = router;