import { NextRequest, NextResponse } from 'next/server';
import { handleError, validateAccessToken } from '../utils/helpers';
import { ContactService } from '../services/contact.service';

export class ContactController {
    private contactService: ContactService;

    constructor() {
        this.contactService = new ContactService();
    }

    /**
     * Get a list of contacts with optional filtering
     */
    async getContacts(request: NextRequest) {
        const searchParams = request.nextUrl.searchParams;
        const searchValue = searchParams.get('search');
        const filters = searchParams.get('filters');
        const start = searchParams.get('start') || '0';
        const accessToken = searchParams.get('access_token');

        const validationError = validateAccessToken(accessToken);
        if (validationError) return validationError;
        

        try {
            const result = await this.contactService.getContacts(
                accessToken!,
                searchValue,
                filters,
                parseInt(start, 10),
            );

            return NextResponse.json(result);
        } catch (error) {
            return handleError(error);
        }
    }


    /**
     * Create a new contact
     */
    async createContact(request: NextRequest) {
        const body = await request.json();
        const searchParams = request.nextUrl.searchParams;
        const accessToken = searchParams.get('access_token');
        const { contact } = body;

        if (!contact) {
            return NextResponse.json({ error: 'Contact data is required' }, { status: 400 });
        }

        const validationError = validateAccessToken(accessToken);
        if (validationError) return validationError;

        try {
            const result = await this.contactService.createContact(accessToken!, contact);
            return NextResponse.json(result);
        } catch (error) {
            return handleError(error);
        }
    }

    /**
     * Update an existing contact
     */
    async updateContact(request: NextRequest, id: string) {
        const body = await request.json();
        const searchParams = request.nextUrl.searchParams;
        const accessToken = searchParams.get('access_token');
        const { contact } = body;

        if (!contact) {
            return NextResponse.json({ error: 'Invalid contact data' }, { status: 400 });
        }

        const validationError = validateAccessToken(accessToken);
        if (validationError) return validationError;

        try {
            const result = await this.contactService.updateContact(accessToken!, contact, id);
            return NextResponse.json(result);
        } catch (error) {
            return handleError(error);
        }
    }

    /**
     * Delete a contact
     */
    async deleteContact(request: NextRequest, id: string) {
        const accessToken = request.nextUrl.searchParams.get('access_token');

        if (!id) {
            return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
        }

        const validationError = validateAccessToken(accessToken);
        if (validationError) return validationError;

        try {
            const result = await this.contactService.deleteContact(accessToken!, id);
            return NextResponse.json(result);
        } catch (error) {
            return handleError(error);
        }
    }
}
