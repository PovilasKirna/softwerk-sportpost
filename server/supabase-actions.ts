'use server';

export async function createOrRetrieveCustomer({ uuid, email }: { uuid: string; email: string }): Promise<string> {
    return uuid + email;
}
