module.exports = {
    sub : "mocks",
    host : "http://localhost:3000",
    steps : [ 
        {
            entry  : {
                type  : "STAT",
                values : [ "928" ]
            },
            url    : "api/document/{}",
            then   : [
                {
                    entry : {
                        type  : "DYN",
                        values : "previous.nested.id"
                    },
                    url : "api/nested/{}"
                }
            ]
        }
    ]
};