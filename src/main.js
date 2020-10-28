require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URI,{
    useMongoClient: true
}).then(
    (response) => {
        console.log('Successfully connected to mongodb')
    }
).catch(e=>{
    console.error(e);
});

const port = process.env.PORT || 4000;



//라우터 설정
router.get('/',ctx=>{
    ctx.body = '홈';
});
router.get('/about',ctx=>{
    ctx.body = '소개';
});


app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log('Listening to port ' + port);
});
