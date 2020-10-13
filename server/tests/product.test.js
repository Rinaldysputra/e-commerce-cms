const request = require('supertest');
const app = require('../app')
const {sequelize} = require('../models')
const {queryInterface} = sequelize

beforeAll((done)=> {
    const userData = {
        email: 'admin@mail.com',
        password: '1234'
    }
    request(app)
    .post('/users/login')
    .send(userData)
    .set('Accept', 'application/json')
    .end((err, response) => {
        access_token = response.body.access_token
        // console.log(access_token)
        done()
    })
})

var id
var productData = {
    name: 'keyboard',
    image_url: 'https://www.goodgamingshop.com/wp-content/uploads/2019/10/14100407_71c5c640-9b84-43bf-b159-34b418https://d2pa5gi5n2e1an.cloudfront.net/webp/id/images/article/8771_ID/summary.jpg2c4762_2048_2048.jpg',
    price: 2000000,
    stock: 10
}

describe('Success case /postProduct', () => {
    test('Successfully Add Product', (done) => {
        request(app)
        .post('/products')
        .set('access_token', access_token)
        .send(productData)
        .set('Accept', 'application/json')
        .then(response => {
            // console.log(response);
            const {status,body} = response
            console.log(body);
            expect(status).toBe(201)
            id = body.id
            expect(body).toHaveProperty('id', expect.any(Number))
            expect(body).toHaveProperty('name', expect.any(String))
            expect(body).toHaveProperty('image_url', expect.any(String))
            expect(body).toHaveProperty('price', expect.any(Number))
            expect(body).toHaveProperty('stock', expect.any(Number))
            done()
        })
    })
    test('Validation Error', (done) => {
        var productData = {
            name: '',
            image_url: 'https://www.goodgamingshop.com/wp-content/uploads/2019/10/14100407_71c5c640-9b84-43bf-b159-34b418https://d2pa5gi5n2e1an.cloudfront.net/webp/id/images/article/8771_ID/summary.jpg2c4762_2048_2048.jpg',
            price: 2000000,
            stock: 10
        }
        request(app)
        .post('/products')
        .set('access_token', access_token)
        .send(productData)
        .set('Accept', 'application/json')
        .then(response => {
            // console.log(response);
            const {status,body} = response
            console.log(body);
            expect(status).toBe(400)
            done()
        })
    })
})

describe('Success Case /getProduct', () => {
    test('Successfully Get All Product', (done) => {
        request(app)
        .get('/products')
        .set('access_token', access_token)
        .send(productData)
        .set('Accept', 'application/json')
        .then(response => {
            const {status, body} = response
            expect(status).toBe(200)
            expect(body[0]).toHaveProperty('id', expect.any(Number))
            expect(body[0]).toHaveProperty('name', expect.any(String))
            expect(body[0]).toHaveProperty('image_url', expect.any(String))
            expect(body[0]).toHaveProperty('price', expect.any(Number))
            expect(body[0]).toHaveProperty('stock', expect.any(Number))
            done()
        })
    })
})

describe('Success Case /putProduct', () => {
    var productDataPut = {
        name: 'keyboard',
        image_url: 'https://www.goodgamingshop.com/wp-content/uploads/2019/10/14100407_71c5c640-9b84-43bf-b159-34b418https://d2pa5gi5n2e1an.cloudfront.net/webp/id/images/article/8771_ID/summary.jpg2c4762_2048_2048.jpg',
        price: 2000000,
        stock: 9
    }
    test('Successfully Update Product', (done) => {
        request(app)
        .put(`/products/${id}`)
        .set('access_token', access_token)
        .send(productDataPut)
        .set('Accept', 'application/json')
        .then(response => {
            const {status, body} = response
            expect(status).toBe(201)
            expect(body).toHaveProperty('message', 'Edit Successfully')
            done()
        })
    })
})

describe('Success Case /deleteProduct', () => {
    test('Successfully Delete Product', (done) => {
        request(app)
        .delete(`/products/${id}`)
        .set('access_token', access_token)
        .set('Accept', 'application/json')
        .then(response => {
            const {status, body} = response
            expect(status).toBe(200)
            expect(body).toHaveProperty('message', 'Product Deleted')
            done()
        })
    })
})

afterAll((done) => {
    queryInterface.bulkDelete('Products')
    .then(()=> {
        done()
    })
    .catch(err => {
        console.log(err)
        done()
    })
})
