"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowupsController = void 0;
const common_1 = require("@nestjs/common");
const followups_service_1 = require("./followups.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_followup_dto_1 = require("./create-followup.dto");
let FollowupsController = class FollowupsController {
    service;
    constructor(service) {
        this.service = service;
    }
    getAll(req) {
        return this.service.getAllForUser(req.user.userId);
    }
    getUpcoming(req) {
        return this.service.getUpcoming(req.user.userId);
    }
    getByLead(leadId, req) {
        return this.service.getByLead(req.user.userId, Number(leadId));
    }
    create(body, req) {
        return this.service.create(req.user.userId, body.leadId, body.date, body.remark);
    }
    complete(id, req) {
        return this.service.markCompleted(req.user.userId, Number(id));
    }
};
exports.FollowupsController = FollowupsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FollowupsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FollowupsController.prototype, "getUpcoming", null);
__decorate([
    (0, common_1.Get)(':leadId'),
    __param(0, (0, common_1.Param)('leadId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FollowupsController.prototype, "getByLead", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_followup_dto_1.CreateFollowupDto, Object]),
    __metadata("design:returntype", void 0)
], FollowupsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FollowupsController.prototype, "complete", null);
exports.FollowupsController = FollowupsController = __decorate([
    (0, common_1.Controller)('followups'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [followups_service_1.FollowupsService])
], FollowupsController);
//# sourceMappingURL=followups.controller.js.map