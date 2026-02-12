import axios from 'api/axios';

async function test() {
    const test = await axios.get("/servant/test");
    return test.data;
}

export default test;
