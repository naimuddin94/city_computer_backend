"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
class QueryBuilder {
    constructor(model, query) {
        this.model = model;
        this.query = query;
        this.where = {};
        this.prisma = lib_1.prisma;
        this.model = model;
        this.query = query;
    }
    // Search method with support for related models
    search(searchableFields) {
        const searchTerm = this.query?.searchTerm;
        if (searchTerm) {
            this.where.OR = searchableFields.map((field) => {
                if (field.includes(".")) {
                    // Handle related models (e.g., "category.name")
                    const [model, fieldName] = field.split(".");
                    return {
                        [model]: {
                            [fieldName]: {
                                contains: searchTerm,
                                mode: "insensitive",
                            },
                        },
                    };
                }
                return {
                    [field]: { contains: searchTerm, mode: "insensitive" },
                };
            });
        }
        return this;
    }
    // Filter by filtering fields
    filter() {
        const excludeFields = ["searchTerm", "sort", "page", "limit", "fields"];
        const filters = Object.fromEntries(Object.entries(this.query).filter(([key]) => !excludeFields.includes(key)));
        this.where = { ...this.where, ...filters };
        return this;
    }
    // Sort functionality
    sort() {
        const sortParam = this.query?.sort;
        if (sortParam) {
            this.orderBy = sortParam.split(",").reduce((acc, field) => {
                // const fieldName = field.replace("-", "");
                // acc[fieldName] = field.startsWith("-") ? "desc" : "asc";
                const fieldName = field.replace("-", "");
                acc.push({ [fieldName]: field.startsWith("-") ? "desc" : "asc" });
                return acc;
            }, []);
        }
        else {
            this.orderBy = [{ createdAt: "desc" }];
        }
        return this;
    }
    // Pagination functionality
    paginate() {
        const limit = Number(this.query?.limit) || 10;
        const page = Number(this.query?.page) || 1;
        this.pagination = {
            skip: (page - 1) * limit,
            take: limit,
        };
        return this;
    }
    // Exclude fields from response
    fields(fields) {
        let fieldsParam = fields.join(",");
        if (this.query?.fields) {
            fieldsParam = this.query?.fields;
        }
        if (fieldsParam) {
            this.selectFields = fieldsParam.split(",").reduce((acc, field) => {
                const parts = field.trim().split(".");
                if (parts.length === 2) {
                    const [model, fieldName] = parts;
                    if (!acc[model]) {
                        acc[model] = { select: {} };
                    }
                    acc[model].select[fieldName] = true;
                }
                else {
                    acc[parts[0]] = true;
                }
                return acc;
            }, {});
        }
        return this;
    }
    // For executing model queries
    async execute() {
        const modelInstance = this.prisma[this.model];
        //@ts-expect-error
        return await modelInstance.findMany({
            where: this.where,
            orderBy: this.orderBy,
            ...this.pagination,
            select: this.selectFields,
        });
    }
    // For count all data and get meta data
    async countTotal() {
        const modelInstance = this.prisma[this.model];
        //@ts-expect-error
        const total = await modelInstance.count({ where: this.where });
        const limit = Number(this.query?.limit) || 8;
        const page = Number(this.query?.page) || 1;
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
exports.default = QueryBuilder;
