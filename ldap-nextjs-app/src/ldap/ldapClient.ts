import ldap from 'ldapjs';

const serverUrl = 'ldap://192.168.16.99:389';
const bindDN = "administrator@Test.local";
const bindPassword = 'Yello100';

export const client = ldap.createClient({
    url: serverUrl,
    reconnect: true,
    tlsOptions: { rejectUnauthorized: false },  // Allow insecure connections (if necessary)
});

export const connectToAD = async () => {
    return new Promise<void>((resolve, reject) => {
        client.bind(bindDN, bindPassword, (err: any) => {
            if (err) {
                console.error('LDAP Bind Failed:', err);
                reject(err);
            } else {
                console.log('✅ Connected to Active Directory');
                resolve();
            }
        });
    });
};

// Function to Add a User to Active Director
export const addUser = async (user: { cn: string; sn: string; mail: string; password: string }) => {
    return new Promise((resolve, reject) => {
        const userDN = `CN=${user.cn},OU=Users,DC=Test,DC=local`; // Adjust OU and domain as needed
        const newUser = {
            cn: user.cn,
            sn: user.sn,
            mail: user.mail,
            objectClass: ['top', 'person', 'organizationalPerson', 'user'],
            userPassword: user.password, // LDAP doesn't store passwords directly like this in AD
        };
        
        client.add(userDN, newUser, (err) => {
            if (err) {
                console.error('Error adding user:', err);
                return reject(err);
            }
            console.log(`✅ User ${user.cn} added successfully.`);
            resolve(true);
        });
    });
};


export const disconnectFromAD = () => {
    client.unbind((err) => {
        if (err) {
            console.error('Error unbinding:', err);
        } else {
            console.log('🔌 Disconnected from Active Directory');
        }
    });
};



