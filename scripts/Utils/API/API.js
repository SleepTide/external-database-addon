import { http, HttpHeader, HttpRequest, HttpRequestMethod, } from "@minecraft/server-net";
import Config from "../../Lib/Config";
export default class API {
    static URI;
    static BaseHeaders;
    constructor() {
        API.URI = `http://${Config.API.host}:${Config.API.port}`;
        API.BaseHeaders = [new HttpHeader("Content-Type", "application/json")];
    }
    static async CheckStatus() {
        const data = new HttpRequest(this.URI + "/status/");
        data.setHeaders(this.BaseHeaders);
        data.setBody(JSON.stringify({}));
        data.setMethod(HttpRequestMethod.POST);
        const request = await http.request(data);
        return request.status === 200;
    }
    static async CreateMember(member) {
        const data = new HttpRequest(this.URI + "/members/create/");
        data.setHeaders(this.BaseHeaders);
        data.setBody(JSON.stringify(member));
        data.setMethod(HttpRequestMethod.POST);
        const request = await http.request(data);
        return request.status === 200;
    }
    static async DeleteMember(entity_id) {
        const data = new HttpRequest(this.URI + `/members/delete/${entity_id}/`);
        data.setHeaders(this.BaseHeaders);
        data.setBody(JSON.stringify({}));
        data.setMethod(HttpRequestMethod.POST);
        const request = await http.request(data);
        if (request.status !== 200) {
            console.error("Error while deleting member:", request.status, JSON.stringify(request.body));
            return false;
        }
        return true;
    }
    static async GetMember(entity_id) {
        const data = new HttpRequest(this.URI + `/members/get/${entity_id}`);
        data.setMethod(HttpRequestMethod.GET);
        data.setHeaders(this.BaseHeaders);
        const request = await http.request(data);
        const body = JSON.parse(request.body);
        return body.member ?? null;
    }
    static async SearchMember(username) {
        const data = new HttpRequest(this.URI + `/members/search/`);
        data.setMethod(HttpRequestMethod.POST);
        data.setBody(JSON.stringify({
            username,
        }));
        data.setHeaders(this.BaseHeaders);
        const request = await http.request(data);
        const body = JSON.parse(request.body);
        return body.member ?? null;
    }
}
