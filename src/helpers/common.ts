import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as FormData from 'form-data';
import { CreateEventTmsDto } from 'src/events/dto/create-event-tms.dto';
import { UpdateEventTmsDto } from 'src/events/dto/update-event-tms.dto';
import { ParticipantDto } from './dto/participant-dto';

dotenv.config();

export class CommonOpenApi {
    public async authTms() {
        const payload = {
            email: process.env.TMS_EMAIL,
            password: process.env.TMS_PASSWORD,
        };
        try {
            const response = await axios.post(`${process.env.TMS_BASE_URL}/auth/login`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.request.res.statusCode !== 200) {
                throw new BadRequestException('Failed to authenticate with TMS');
            }

            return response.data.data;
        } catch (error) {
            throw new BadRequestException('Failed to authenticate with TMS: ' + error.message);
        }
    }

    public async getUserInformation(email: string) {
        const auth = await this.authTms();

        try {
            const response = await axios.get(
                `${process.env.TMS_BASE_URL}/events/participant/by-email/${email}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.tokens.access_token}`,
                    },
                },
            );

            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    return { participant_level: '' };
                }

                throw new BadRequestException('Failed to fetch user information on TMS: ' + error);
            }

            throw new InternalServerErrorException('Unexpected error when calling TMS API');
        }
    }
    public async createEvent(data: CreateEventTmsDto){
        const auth = await this.authTms()
        let formData = new FormData();
        try {
            formData.append('poster', data.poster.buffer, { filename: data.poster.originalname });
            formData.append('program_categories_id', data.program_categories_id);
            formData.append('program_types_id', data.program_types_id);
            formData.append('name', data.name);
            formData.append('start_datetime', data.start_datetime);
            formData.append('end_datetime', data.end_datetime);
            formData.append('target_participants', data.target_participants);
            formData.append('location', data.location);
            formData.append('description', data.description);
            formData.append('ticket_price', data.ticket_price);
            formData.append('budget', data.budget);
            formData.append('source_budget', data.source_budget);
            formData.append('min_age', data.min_age);
            formData.append('max_age', data.max_age);
            formData.append('participant_background', data.participant_background);
            formData.append('theme', data.theme);

            const headers = {
                ...formData.getHeaders(),
                Authorization: `Bearer ${auth.tokens.access_token}`,
            };

            const response = await axios.post(`${process.env.TMS_BASE_URL}/events`, formData, { headers });

            console.log('Response API: ', response)

            return response.data.data;
        } catch (error) {
            if (error.response?.status === 404) {
                console.log("TMS returned 404, skipping createEvent...");
                return null; 
            }
            throw new BadRequestException('Failed to create event on TMS: ' + error + data.program_categories_id + data.program_types_id + process.env.TMS_BASE_URL + data.poster);
        }
    }
    public async updateEvent(data: UpdateEventTmsDto){
        const auth = await this.authTms()
        let formData = new FormData();
        try {
            formData.append('program_categories_id', data.program_categories_id);
            formData.append('program_types_id', data.program_types_id);
            formData.append('name', data.name);
            formData.append('start_datetime', data.start_datetime);
            formData.append('end_datetime', data.end_datetime);
            formData.append('target_participants', data.target_participants);
            formData.append('location', data.location);
            formData.append('description', data.description);
            formData.append('ticket_price', data.ticket_price);
            formData.append('budget', data.budget);
            formData.append('source_budget', data.source_budget);
            formData.append('min_age', data.min_age);
            formData.append('max_age', data.max_age);
            formData.append('participant_background', data.participant_background);
            formData.append('theme', data.theme);
            if (data.poster) {
                formData.append('poster', data.poster.buffer, { filename: data.poster.originalname });
            }

            const headers = {
                ...formData.getHeaders(),
                Authorization: `Bearer ${auth.tokens.access_token}`,
            };

            const response = await axios.post(`${process.env.TMS_BASE_URL}/events/${data.id}`, formData, { headers });

            console.log('Response API: ', response)

            if (response.status !== 200) {
                throw new BadRequestException('Failed to update event on TMS');
            }

            return response.data.data;
        } catch (error) {
            if (error.response?.status === 404) {
                console.log("TMS returned 404, skipping createEvent...");
                return null; 
            }
            throw new BadRequestException('Failed to update event on TMS: ' + error + data);
        }
    }
    public async deleteEvent(event_id: string[]){
        const auth = await this.authTms()
        try {
            const response = await axios.post(
                `${process.env.TMS_BASE_URL}/events/delete-event`,
                { id: event_id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${auth.tokens.access_token}`,
                    },
                }
            );

            console.log('Response API: ', response)

            if (response.status !== 200) {
                throw new BadRequestException('Failed to create event on TMS');
            }

            return response.data.data;
        } catch (error) {
            if (error.response?.status === 404) {
                console.log("TMS returned 404, skipping createEvent...");
                return null; 
            }
            throw new BadRequestException('Failed to create event on TMS: ' + error);
        }
    }
    public async getCampus(page, per_page: number, search: string) {
        try {
            const response = await axios.get(`${process.env.TMS_BASE_URL}/campus`, {
                params: {
                    page,
                    per_page,
                    exact_search: search,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status !== 200) {
                throw new BadRequestException('Failed to fetch campus from TMS');
            }

            return response.data.data;
        } catch (error) {
            throw new BadRequestException(
                'Failed to fetch campus from TMS: ' + error.message,
            );
        }
    }
    public async createCampus(campus_name: string) {
        const payload = {
            id: 0,
            name: campus_name,
            majors: [],
        };
        try {
            const response = await axios.post(`${process.env.TMS_BASE_URL}/campus`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.request.res.statusCode !== 200) {
                throw new BadRequestException('Failed to create campus with TMS');
            }

            return response.data;
        } catch (error) {
            throw new BadRequestException('Failed to create campus with TMS: ' + error.message);
        }
    }
    public async updateCampus(id_campus: string, campus_name: string) {
        const payload = {
            name: campus_name
        };
        try {
            const response = await axios.post(`${process.env.TMS_BASE_URL}/campus/update/${id_campus}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.request.res.statusCode !== 200) {
                throw new BadRequestException('Failed to update campus with TMS');
            }

            return response.data.data;
        } catch (error) {
            throw new BadRequestException('Failed to update campus with TMS: ' + error.message);
        }
    }
    public async deleteCampus(id_campus: string) {
        try {
            const response = await axios.post(`${process.env.TMS_BASE_URL}/campus/delete/${id_campus}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.request.res.statusCode !== 200) {
                throw new BadRequestException('Failed to delete campus with TMS');
            }

            return response.data.data;
        } catch (error) {
            throw new BadRequestException('Failed to delete campus with TMS: ' + error.message);
        }
    }
    public async getMajorCampus(page, per_page: number, campus_id, search: string) {
        try {
            const response = await axios.get(`${process.env.TMS_BASE_URL}/majors`, {
                params: {
                    page,
                    per_page,
                    exact_search: search,
                    campus_id,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status !== 200) {
                throw new BadRequestException('Failed to fetch major campus from TMS');
            }

            return response.data.data;
        } catch (error) {
            throw new BadRequestException(
                'Failed to fetch major campus from TMS: ' + error.message,
            );
        }
    }
    public async createMajorCampus(id_campus, major_name: string) {
        const payload = {
            campus_id: id_campus,
            name: major_name,
        };
        try {
            const response = await axios.post(`${process.env.TMS_BASE_URL}/majors`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.request.res.statusCode !== 200) {
                throw new BadRequestException('Failed to create major campus with TMS');
            }

            return response.data;
        } catch (error) {
            throw new BadRequestException('Failed to create major campus with TMS: ' + error.message);
        }
    }
    public async updateMajorCampus(id_campus, id_major, campus_name: string) {
        const payload = {
            campus_id: id_campus,
            name: campus_name,
        };
        try {
            const response = await axios.post(`${process.env.TMS_BASE_URL}/majors/update/${id_major}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.request.res.statusCode !== 200) {
                throw new BadRequestException('Failed to update major campus with TMS');
            }

            return response.data.data;
        } catch (error) {
            throw new BadRequestException('Failed to update major campus with TMS: ' + error.message);
        }
    }
    public async deleteMajorCampus(id_major: string) {
        const payload = {
            id: [id_major]
        }
        try {
            const response = await axios.post(`${process.env.TMS_BASE_URL}/majors/delete`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.request.res.statusCode !== 200) {
                throw new BadRequestException('Failed to delete major campus with TMS');
            }

            return response.data.data;
        } catch (error) {
            throw new BadRequestException('Failed to delete major campus with TMS: ' + error.message);
        }
    }
    public async participantTransaction(dataPayload: ParticipantDto) {
        const auth = await this.authTms()
        try {
            const response = await axios.post(`${process.env.TMS_BASE_URL}/events/participant/${dataPayload.type}`, dataPayload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.tokens.access_token}`,
                },
            });

            if (response.request.res.statusCode !== 200) {
                throw new BadRequestException(`Failed to participant transaction ${dataPayload.type} with TMS`);
            }

            return response.data.data;
        } catch (error) {
            throw new BadRequestException(`Failed to participant transaction ${dataPayload.type} with TMS: ` + error.message + `${process.env.TMS_BASE_URL}/events/participant/${dataPayload.type}` + JSON.stringify(dataPayload));
        }
    }
    public async filterProgramCategory() {
        const auth = await this.authTms()
        try {
            const response = await axios.get(`${process.env.TMS_BASE_URL}/events/filter/program-category`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.tokens.access_token}`,
                },
            });

            if (response.request.res.statusCode !== 200) {
                throw new BadRequestException(`Failed to filter program category with TMS`);
            }

            return response.data;
        } catch (error) {
            throw new BadRequestException(`Failed to filter program category with TMS: ` + error.message);
        }
    }
    public async filterProgramType() {
        const auth = await this.authTms()
        try {
            const response = await axios.get(`${process.env.TMS_BASE_URL}/events/filter/program-type`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.tokens.access_token}`,
                },
            });

            if (response.request.res.statusCode !== 200) {
                throw new BadRequestException(`Failed to filter program type with TMS`);
            }

            return response.data;
        } catch (error) {
            throw new BadRequestException(`Failed to filter program type with TMS: ` + error.message);
        }
    }
}