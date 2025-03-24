import {
    http,
    HttpHeader,
    HttpRequest,
    HttpRequestMethod,
} from "@minecraft/server-net";
import Config from "../../Lib/Config";

export type Member = {
    entity_id: string;
    username: string;
};

export default class API {
    public static URI: string;
    public static BaseHeaders: HttpHeader[];

    constructor() {
        API.URI = `http://${Config.API.host}:${Config.API.port}`;
        API.BaseHeaders = [new HttpHeader("Content-Type", "application/json")];
    }

    public static async CheckStatus(): Promise<boolean> {
        const data = new HttpRequest(this.URI + "/status/");

        data.setHeaders(this.BaseHeaders);
        data.setBody(JSON.stringify({}));
        data.setMethod(HttpRequestMethod.Post);

        const request = await http.request(data);

        return request.status === 200;
    }

    public static async CreateMember(member: Member): Promise<boolean> {
        const data = new HttpRequest(this.URI + "/members/create/");

        data.setHeaders(this.BaseHeaders);
        data.setBody(JSON.stringify(member));
        data.setMethod(HttpRequestMethod.Post);

        const request = await http.request(data);

        return request.status === 200;
    }
    public static async DeleteMember(entity_id: string): Promise<boolean> {
        const data = new HttpRequest(
            this.URI + `/members/delete/${entity_id}/`,
        );

        data.setHeaders(this.BaseHeaders);
        data.setBody(JSON.stringify({}));
        data.setMethod(HttpRequestMethod.Post);

        const request = await http.request(data);

        if (request.status !== 200) {
            console.error(
                "Error while deleting member:",
                request.status,
                JSON.stringify(request.body),
            );
            return false;
        }

        return true;
    }
    public static async GetMember(entity_id: string): Promise<Member | null> {
        const data = new HttpRequest(this.URI + `/members/get/${entity_id}`);

        data.setMethod(HttpRequestMethod.Get);
        data.setHeaders(this.BaseHeaders);

        const request = await http.request(data);
        const body = JSON.parse(request.body);

        return body.member ?? null;
    }
    public static async SearchMember(username: string): Promise<Member | null> {
        const data = new HttpRequest(this.URI + `/members/search/`);

        data.setMethod(HttpRequestMethod.Post);
        data.setBody(
            JSON.stringify({
                username,
            }),
        );
        data.setHeaders(this.BaseHeaders);

        const request = await http.request(data);
        const body = JSON.parse(request.body);

        return body.member ?? null;
    }
}
