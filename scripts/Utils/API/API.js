import { http, HttpHeader, HttpRequest, HttpRequestMethod, } from "@minecraft/server-net";
import Config from "../../Lib/Config";
import Sleep from "../Sleep/Sleep";
import { system } from "@minecraft/server";
export default class API {
    static URI;
    static BaseHeaders;
    constructor() {
        API.URI = `http://${Config.API.host}:${Config.API.port}`;
        system.run(() => {
            API.BaseHeaders = [new HttpHeader("Content-Type", "application/json")];
        });
    }
    static async CheckStatus() {
        await Sleep(0);
        const data = new HttpRequest(this.URI + "/status/");
        data.setHeaders(this.BaseHeaders);
        data.setBody(JSON.stringify({}));
        data.setMethod(HttpRequestMethod.Post);
        const request = await http.request(data);
        return request.status === 200;
    }
    static async CreateMember(member) {
        await Sleep(0);
        const data = new HttpRequest(this.URI + "/members/create/");
        data.setHeaders(this.BaseHeaders);
        data.setBody(JSON.stringify(member));
        data.setMethod(HttpRequestMethod.Post);
        const request = await http.request(data);
        return request.status === 200;
    }
    static async DeleteMember(entity_id) {
        await Sleep(0);
        const data = new HttpRequest(this.URI + `/members/delete/${entity_id}/`);
        data.setHeaders(this.BaseHeaders);
        data.setBody(JSON.stringify({}));
        data.setMethod(HttpRequestMethod.Post);
        const request = await http.request(data);
        if (request.status !== 200) {
            console.error("Error while deleting member:", request.status, JSON.stringify(request.body));
            return false;
        }
        return true;
    }
    static async GetMember(entity_id) {
        await Sleep(0);
        const data = new HttpRequest(this.URI + `/members/get/${entity_id}`);
        data.setMethod(HttpRequestMethod.Get);
        data.setHeaders(this.BaseHeaders);
        const request = await http.request(data);
        const body = JSON.parse(request.body);
        return body.member ?? null;
    }
    static async SearchMember(username) {
        await Sleep(0);
        const data = new HttpRequest(this.URI + `/members/search/`);
        data.setMethod(HttpRequestMethod.Post);
        data.setBody(JSON.stringify({
            username,
        }));
        data.setHeaders(this.BaseHeaders);
        const request = await http.request(data);
        const body = JSON.parse(request.body);
        return body.member ?? null;
    }
}
