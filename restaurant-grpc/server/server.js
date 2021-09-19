require('dotenv').config()
const PROTO_PATH = "./restaurant.proto";
const mongoose = require("mongoose")
var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
const MenuModel = require('./model/menu')
mongoose.connect(
    `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}:${process.env.MONGODB_PORT}`,
)
console.log(`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}:${process.env.MONGODB_PORT}`)

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

var restaurantProto = grpc.loadPackageDefinition(packageDefinition);

const { v4: uuidv4 } = require("uuid");

const server = new grpc.Server();
const menu = [
    {
        id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
        name: "Tomyam Gung",
        price: 500
    },
    {
        id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
        name: "Somtam",
        price: 60
    },
    {
        id: "8551887c-f82d-4e44-88ca-ae2a1ccc92b7",
        name: "Pad-Thai",
        price: 120
    }
];

server.addService(restaurantProto.RestaurantService.service, {
    getAllMenu: async (_, callback) => {
        const menuList = await MenuModel.find()
        const mappedResult = []
        menuList.forEach(menu => {
            mappedResult.push({
                id: menu.id,
                name: menu.name,
                price: menu.price,
            })
        })
        callback(null, { menu: mappedResult });
    },
    get: (call, callback) => {
        let menuItem = menu.find(n => n.id == call.request.id);

        if (menuItem) {
            callback(null, menuItem);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },
    insert: (call, callback) => {
        let menuItem = call.request;
        // menuItem.id = uuidv4();
        console.log('==== Insert ====')
        console.log(menuItem)
        // menu.push(menuItem);
        const savedMenu = new MenuModel(menuItem)
        savedMenu.save()
        callback(null, menuItem);
    },
    update: async (call, callback) => {
        let updatedMenuModel = await MenuModel.findById(call.request.id);
        if (updatedMenuModel) {
            updatedMenuModel.name = call.request.name;
            updatedMenuModel.price = call.request.price;
            updatedMenuModel.save()
            callback(null, updatedMenuModel);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not Found"
            });
        }

    },
    remove: async (call, callback) => {
        console.log(call.request.id)
        const deletedModel = await MenuModel.findByIdAndDelete(call.request.id)
        console.log(deletedModel)
        if (deletedModel) {
            callback(null, {});
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "NOT Found"
            });
        }
    }
});

const removeFromLocalArray = (call) => {
    let existingMenuItemIndex = menu.findIndex(n => n.id == call.request.id);
    if (existingMenuItemIndex != -1) {
        menu.splice(existingMenuItemIndex, 1);
        console.log("=========")
        console.log(menu)
        callback(null, {});
    } else {
        callback({
            code: grpc.status.NOT_FOUND,
            details: "NOT Found"
        });
    }
}

const updateFromLocalArray = (call) => {
    let existingMenuItem = menu.find(n => n.id == call.request.id);
    if (existingMenuItem) {
        existingMenuItem.name = call.request.name;
        existingMenuItem.price = call.request.price;
        callback(null, existingMenuItem);
    } else {
        callback({
            code: grpc.status.NOT_FOUND,
            details: "Not Found"
        });
    }
}

server.bind("127.0.0.1:30043", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:30043");
server.start();