const express = require('express')
const app = express()

const document = {
    id : "928",
    nested : [{
        id : "a"
    },
    {
        id : "b"
    },
    {
        id : "c"
    },
    {
        id : "d"
    }]
};

const nestMap = {
    a : {
        obj : "a"
    },
    b : {
        obj : "b"
    },
    c : {
        obj : "c"
    },
    d : {
        obj : "d"
    }
};

app.get('/api/document/:doc', (req, res) => {
    var doc = req.params.doc;
    if(doc === document.id){
        res.send(document);
    }
    else {
        res.sendStatus(404);
    }
});

app.get('/api/nested/:doc', (req, res) => {
    var doc = req.params.doc;
    if(nestMap.hasOwnProperty(doc)){
        res.send(nestMap[doc]);
    }
    else {
        res.sendStatus(404);
    }
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))