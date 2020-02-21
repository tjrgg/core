import { Snowflake } from '../../../util/Snowflake';

import type { Client } from '../../Client';
import type { WebhookClient } from '../../WebhookClient';
import type { APIWebhookData, WebhookType, APIUserData } from '../../../util/types/DiscordAPI';
import { Routes } from '../../../util/Constants';

export interface WebhookUpdateData {
	name?: string;
	avatar?: string;
	channelID?: string;
}

export class Webhook {

	public id: string;
	public type: WebhookType;
	public guildID?: string;
	public channelID: string;
	public user?: APIUserData;
	public name: string | null = null;
	public avatar: string | null = null;
	public token?: string;

	public constructor(public client: Client | WebhookClient, data: APIWebhookData) {
		this.id = data.id;
		this.type = data.type;
		this.channelID = data.channel_id;
		this.guildID = data.guild_id;
		this.token = data.token;

		this._patch(data);
	}

	public _patch(data: APIWebhookData): void {
		this.user = data.user;
		this.name = data.name;
		this.avatar = data.avatar;
	}

	/**
	 * The guild that this webhook is in
	 */
	/*
	get guild(): Guild {
		return this.client.guilds.get(this.guildID) || null;
	}
	*/

	/**
	 * The channel of this webhook
	 */
	/*
	get channel(): Channel {
		return this.client.channels.get(this.channelID) || null;
	}
	*/

	/**
	 * The timestamp the webhook was created at
	 */
	get createdTimestamp(): number {
		return new Snowflake(this.id).timestamp;
	}

	/**
	 * The time the webhook was created at
	 */
	get createdAt(): Date {
		return new Snowflake(this.id).date;
	}

	/**
	 * Sends a message over the webhook
	 * @param data Message data
	 */
	public async send(data: any): Promise<unknown> {
		if (!this.token) throw new Error('The token on this webhook is unknown. You cannot send messages.');
		return this.client.api.post(Routes.webhookTokened(this.id, this.token), { auth: false, data });
	}

	/**
	 * Updates the webhook properties
	 * @param param0 Data to update the webhook with
	 */
	public update({ name, avatar, channelID }: WebhookUpdateData): Promise<unknown> {
		return channelID || !this.token ?
			// Requires MANAGE_WEBHOOKS permission to update channelID or to update without the token
			// eslint-disable-next-line @typescript-eslint/camelcase
			this.client.api.patch(Routes.webhook(this.id), { data: { name, avatar, channel_id: channelID } }) :
			// Doesn't require any permissions, but you cannot change the channelID
			this.client.api.patch(Routes.webhookTokened(this.id, this.token), { auth: false, data: { name, avatar } });
	}

	/**
	 * Delete this webhook from the api
	 */
	public delete(): Promise<unknown> {
		return this.token ?
			// If we know the webhook token, we can delete it with less permissions
			this.client.api.delete(Routes.webhookTokened(this.id, this.token), { auth: false }) :
			// Requires MANAGE_WEBHOOKS permission
			this.client.api.delete(Routes.webhook(this.id));
	}

	/**
	 * Fetch a webhook from the api
	 * @param client The Project Blue client
	 * @param id The webhook id you want to fetch
	 * @param token The token of the webhook
	 */
	public static async fetch(client: Client | WebhookClient, id: string, token?: string): Promise<Webhook> {
		const webhookData = await (token ?
			client.api.get(Routes.webhookTokened(id, token), { auth: false }) :
			client.api.get(Routes.webhook(id)));

		return new this(client, webhookData as APIWebhookData);
	}

}
