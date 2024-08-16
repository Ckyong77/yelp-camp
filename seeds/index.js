const mongoose = require('mongoose')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../models/campground')

async function main(){
    await mongoose.connect('mongodb://localhost:27017/yelp-camp')
}

main()
.then(()=> {
    console.log('database is conncted!')
})
.catch((err)=>{
    console.log('Failed Connection')
    console.log(err)
})

const sample = function (array){
    return(array[Math.floor(Math.random()*array.length)]);
}

const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random()*1000)
        const price = (Math.floor(Math.random()*20))+10;
        const camp = new Campground({
            author: '66bb8153d334a7987456c389',
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:`https://picsum.photos/id/${i}/200/300`,
            price: price,
            description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum recusandae sint excepturi delectus dignissimos sunt dolor atque quos distinctio, repudiandae laudantium tempore voluptates, consequatur tempora a provident beatae reiciendis quo?`
        })
        await camp.save()
    }
}
seedDB().then(()=>{
    mongoose.connection.close()
    console.log('database closed')
})