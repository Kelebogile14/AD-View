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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUser = void 0;
const ldapClient_1 = require("./ldapClient");
const searchUser = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const searchOptions = {
            scope: 'sub',
            filter: `(cn=${userID})`,
            attributes: ['cn', 'mail', 'dn'],
            sizeLimit: 500,
            derefAliases: 0, // Avoid following referrals
        };
        ldapClient_1.client.search('DC=Test,DC=local', searchOptions, (err, res) => {
            if (err) {
                const ldapError = err;
                if (ldapError.name === 'ReferralError') {
                    console.warn("LDAP Referral received, ignoring:", ldapError.lde_message);
                    return resolve(false); // Return false instead of rejecting
                }
                console.error("Search failed:", ldapError.lde_message || ldapError.message);
                return reject(err);
            }
            let userExists = false;
            res.on('searchEntry', (entry) => {
                console.log("User found!", entry.object);
                userExists = true;
            });
            res.on('error', (error) => {
                console.error("Error during search:", error);
                reject(error);
            });
            res.on('end', () => resolve(userExists));
        });
    });
});
exports.searchUser = searchUser;
