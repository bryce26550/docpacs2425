const readline = require("readline")
const {stdin: input, stdout: output} = require("process")

let inter = readline.createInterface({input, output})

let orders = []

function program() {
    inter.write(" 1. Start a New Order \n 2. Edit Existing Order \n 3. Show All Orders\n")
    inter.question("What would you like to do? ", (answer) => {
        switch (answer) {
            case "1":
                inter.question("Enter Name: ", (name) => {
                    inter.question("Enter Address: ", (address) => {
                        let order = {}
                        order.name = name
                        order.address = address
                        order.items = []
                        orders.push(order)
                        inter.write('\n')
                        program()
                    })
                })
                break;
            case "2": 
                for (let i = 0; i < orders.length; i++) {
                    inter.write(" " + (i+1) + ". " + orders[i].name + ": " + orders[i].address + "\n")
                }
                inter.question("What order would you like to edit? ", (answer) => {
                    let index = answer - 1
                    function addItem() {
                        inter.write(" 1. Add an Item \n 2. Finish Editing \n")
                        inter.question("What would you like to do? ", (answer) => {
                            switch (answer) {
                                case "1":
                                    inter.question("Enter Item Name: ", (itemName) => {
                                        inter.question("Enter Item Quantity ", (quantity) => {
                                            inter.question("Enter Item Unit Price: ", (price) => {
                                                inter.question("Enter Item Retail Price: ", (retail) => {
                                                    let item = {}
                                                    item.name = itemName
                                                    item.quantity = quantity
                                                    item.unitPrice = price
                                                    item.retailPrice = retail
    
                                                    orders[index].items.push(item)
                                                    console.log(orders[index])
                                                    addItem()
                                                })
                                            })
                                        })
                                    })
                                    break;
                                case "2":
                                    let items = orders[index].items
                                    let subtotal = 0;
                                    let profit = 0;
                                    let shipping = 0;
                                    items.forEach(item => {
                                        subtotal += item.retailPrice * item.quantity
                                    });
                                    let unitTotal = 0;
                                    items.forEach(item => {
                                        unitTotal += item.unitPrice * item.quantity
                                    });
                                    profit = subtotal - unitTotal;
                                    let salesTax = subtotal * 0.06
                                    if (subtotal < 50) {
                                        shipping = 5
                                    }
                                    let total = subtotal + salesTax + shipping
                                    orders[index].subtotal = subtotal
                                    orders[index].profit = profit
                                    orders[index].salesTax = salesTax
                                    orders[index].shipping = shipping
                                    orders[index].total = total
                                    program()
                                    break;    
                            }
                        })
                    }
                    addItem()
                })
                break;
            case "3": 
                for (let i = 0; i < orders.length; i++) {
                    console.log(`${orders[i].name}: ${orders[i].address}`)
                    orders[i].items.forEach(item => {
                        console.log(`  ${item.name}, ${item.quantity}x, ${item.unitPrice} `)
                    })
                    console.log(" Subtotal: " + orders[i].subtotal)
                    console.log(" Profit: " + orders[i].profit)
                    console.log(" Sales Tax: " + orders[i].salesTax)
                    console.log(" Shipping: " + orders[i].shipping)
                    console.log(" Total: "  + orders[i].total + "\n")
                }
                break;
        }
    })
}

program()