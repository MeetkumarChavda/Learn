import joi from 'joi';

const schema = joi.object({
    name: joi.string()
        .min(3)
        .max(30)
        .required(),

    job: joi.string()
        .min(3)
        .max(30)
        .required(),
});

export default schema;
