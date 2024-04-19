// db.js
const getAllProducts = async () => {
    return [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
}

const getProductById = async (id) => {
    if(id == 1){
        return { id, name: `Product ${id}` };

    }
    else{
        const error = new Error('Product not found');
            error.status = 404;
            throw error;
    }
}

module.exports = {
    getAllProducts,
    getProductById
};