"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectFromAD = exports.addUser = exports.connectToAD = exports.client = void 0;
const ldapjs_1 = __importDefault(require("ldapjs"));
const serverUrl = 'ldap://192.168.16.99:389';
const bindDN = "administrator@Test.local";
const bindPassword = 'Yello100';
exports.client = ldapjs_1.default.createClient({
    url: serverUrl,
    reconnect: true,
    tlsOptions: { rejectUnauthorized: false }, // Allow insecure connections (if necessary)
});
const connectToAD = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        exports.client.bind(bindDN, bindPassword, (err) => {
            if (err) {
                console.error('LDAP Bind Failed:', err);
                reject(err);
            }
            else {
                console.log('✅ Connected to Active Directory');
                resolve();
            }
        });
    });
});
exports.connectToAD = connectToAD;
// Function to Add a User to Active Director
const addUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const userDN = `CN=${user.cn},OU=Users,DC=Test,DC=local`; // Adjust OU and domain as needed
        const newUser = {
            cn: user.cn,
            sn: user.sn,
            mail: user.mail,
            objectClass: ['top', 'person', 'organizationalPerson', 'user'],
            userPassword: user.password, // LDAP doesn't store passwords directly like this in AD
        };
        exports.client.add(userDN, newUser, (err) => {
            if (err) {
                console.error('Error adding user:', err);
                return reject(err);
            }
            console.log(`✅ User ${user.cn} added successfully.`);
            resolve(true);
        });
    });
});
exports.addUser = addUser;
const disconnectFromAD = () => {
    exports.client.unbind((err) => {
        if (err) {
            console.error('Error unbinding:', err);
        }
        else {
            console.log('🔌 Disconnected from Active Directory');
        }
    });
};
exports.disconnectFromAD = disconnectFromAD;
