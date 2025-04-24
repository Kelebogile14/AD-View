import { client } from './ldapClient';
import ldap from 'ldapjs';

export const searchUser = async (userID: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const searchOptions: ldap.SearchOptions = {
            scope: 'sub',
            filter: `(cn=${userID})`,
            attributes: ['cn', 'mail', 'dn'],
            sizeLimit: 500,
            derefAliases:0,  // Avoid following referrals
        };

        client.search('DC=Test,DC=local', searchOptions, (err: any, res: ldap.SearchCallbackResponse) => {
            if (err) {
                const ldapError = err as any;

                if (ldapError.name === 'ReferralError') {
                    console.warn("LDAP Referral received, ignoring:", ldapError.lde_message);
                    return resolve(false);  // Return false instead of rejecting
                }

                console.error("Search failed:", ldapError.lde_message || ldapError.message);
                return reject(err);
            }

            let userExists = false;

            res.on('searchEntry', (entry: ldap.SearchEntry) => {
                console.log("User found!", (entry as any).object);
                userExists = true;
            });

            res.on('error', (error: Error) => {
                console.error("Error during search:", error);
                reject(error);
            });

            res.on('end', () => resolve(userExists));
        });
    });
};
