import { RequestOptions } from '@klasa/rest';
import { DataStore } from './base/DataStore';
import type { APIChannelData, APIOverwriteData, ChannelType } from '@klasa/dapi-types';
import type { Client } from '../../client/Client';
import type { Guild } from '../structures/guilds/Guild';
import type { GuildBasedChannel } from '../../util/Util';
/**
 * The store for {@link GuildBasedChannel guild based channels}.
 * @since 0.0.1
 */
export declare class GuildChannelStore extends DataStore<GuildBasedChannel> {
    /**
     * The {@link Guild guild} this store belongs to.
     * @since 0.0.1
     */
    readonly guild: Guild;
    /**
     * Builds the store.
     * @since 0.0.1
     * @param client The {@link Client client} this store belongs to.
     * @param guild The {@link Guild guild} this store belongs to.
     */
    constructor(client: Client, guild: Guild);
    /**
     * Create a new channel for the {@link Guild guild}.
     * @since 0.0.1
     * @param data The channel settings.
     * @param requestOptions The additional request options.
     * @see https://discord.com/developers/docs/resources/guild#create-guild-channel
     */
    add(data: GuildChannelStoreAddData, requestOptions?: RequestOptions): Promise<GuildBasedChannel>;
    /**
     * Removes a channel from the {@link Guild guild}.
     * @since 0.0.1
     * @param channelID The channel to remove.
     * @param requestOptions The additional request options.
     * @see https://discord.com/developers/docs/resources/channel#deleteclose-channel
     */
    remove(channelID: string, requestOptions?: RequestOptions): Promise<GuildBasedChannel>;
    /**
     * Modifies the positions of the channels.
     * @since 0.0.1
     * @param data The set of channels and their positions for the {@link Guild guild}.
     * @param requestOptions The additional request options.
     * @see https://discord.com/developers/docs/resources/guild#modify-guild-channel-positions
     */
    modifyPositions(data: readonly GuildChannelStorePositionData[], requestOptions?: RequestOptions): Promise<this>;
    /**
     * Returns the list of channels as updated from Discord.
     * @since 0.0.1
     * @see https://discord.com/developers/docs/resources/guild#get-guild-channels
     */
    fetch(): Promise<this>;
    /**
     * Adds a new structure to this DataStore
     * @param data The data packet to add
     */
    protected _add(data: APIChannelData): GuildBasedChannel;
}
/**
 * The data for {@link GuildChannelStore#add}.
 * @since 0.0.1
 * @see https://discord.com/developers/docs/resources/guild#create-guild-channel-json-params
 */
export interface GuildChannelStoreAddData {
    /**
     * Channel name (2-100 characters).
     * @since 0.0.1
     */
    name: string;
    /**
     * The type of channel.
     * @since 0.0.1
     * @see https://discord.com/developers/docs/resources/channel#channel-object-channel-types
     */
    type?: ChannelType;
    /**
     * Channel topic (0-1024 characters).
     * @since 0.0.1
     */
    topic?: string;
    /**
     * The bitrate(in bits) of the voice channel (voice only).
     * @since 0.0.1
     */
    bitrate?: number;
    /**
     * The user limit of the voice channel (voice only).
     * @since 0.0.1
     */
    user_limit?: number;
    /**
     * Amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the
     * permission `MANAGE_MESSAGES` or `MANAGE_CHANNEL`, are unaffected.
     * @since 0.0.1
     */
    rate_limit_per_user?: number;
    /**
     * Sorting position of the channel.
     * @since 0.0.1
     */
    position?: number;
    /**
     * The channel's permission overwrites.
     * @since 0.0.1
     * @see https://discord.com/developers/docs/resources/channel#overwrite-object
     */
    permission_overwrites?: APIOverwriteData[];
    /**
     * Id of the parent {@link CategoryChannel category} for a channel.
     * @since 0.0.1
     */
    parent_id?: string;
    /**
     * Whether the channel is nsfw.
     * @since 0.0.1
     */
    nsfw?: boolean;
}
/**
 * An entry for {@link GuildChannelStore#modifyPositions}.
 * @since 0.0.1
 * @see https://discord.com/developers/docs/resources/guild#modify-guild-channel-positions-json-params
 */
export interface GuildChannelStorePositionData {
    /**
     * The {@link Channel channel} ID.
     * @since 0.0.1
     */
    id: string;
    /**
     * The sorting position of the {@link Channel channel}.
     * @since 0.0.1
     */
    position: number | null;
}