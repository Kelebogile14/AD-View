import { connectToAD, disconnectFromAD } from './ldap/ldapClient';
import { searchUser } from './ldap/ldapSearch';

const run = async () => {
    try {
        await connectToAD();
        
        const userExists = await searchUser('testuser');
        console.log(userExists ? 'User exists' : 'User not found');

    } catch (error) {
        console.error("Error:", error);
    } finally {
        disconnectFromAD();
    }
};

run();
