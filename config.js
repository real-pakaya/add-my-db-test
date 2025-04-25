const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    SESSION_ID: process.env.SESSION_ID === undefined ? 'NIYOX=5L1hyQ5B#4yu4UNJTmA1rV3MKBxVcHXYyaLVafHZFcil8gGRE_R0' : process.env.SESSION_ID, //ADD YOUR SESSION ID
    GITHUB_USER_NAME: process.env.GITHUB_USER_NAME === undefined ? 'real-pakaya' : process.env.GITHUB_USER_NAME, //ADD YOUR GITHUB USERNAME
    GITHUB_AUTH_TOKEN: process.env.GITHUB_AUTH_TOKEN === undefined ? 'DRialmieCDBsTLKAq9wSorgq9Ik7o62Im9DM' : process.env.GITHUB_AUTH_TOKEN //ADD YOUR GITHUB AUTH TOKEN WITHOUT gph_ ,  example - G5OxxdvEbiBPWxm4A0xypQGlyCr4FS267ifz
};

/**
  _____    _____    _____   __  __   ______     _   _   _____  __     __   ____   __   __    __  __   _____  
 |  __ \  |  __ \  |_   _| |  \/  | |  ____|   | \ | | |_   _| \ \   / /  / __ \  \ \ / /   |  \/  | |  __ \ 
 | |__) | | |__) |   | |   | \  / | | |__      |  \| |   | |    \ \_/ /  | |  | |  \ V /    | \  / | | |  | |
 |  ___/  |  _  /    | |   | |\/| | |  __|     | . ` |   | |     \   /   | |  | |   > <     | |\/| | | |  | |
 | |      | | \ \   _| |_  | |  | | | |____    | |\  |  _| |_     | |    | |__| |  / . \    | |  | | | |__| |
 |_|      |_|  \_\ |_____| |_|  |_| |______|   |_| \_| |_____|    |_|     \____/  /_/ \_\   |_|  |_| |_____/ 
 */                                                                                                            
                                                                                                             
