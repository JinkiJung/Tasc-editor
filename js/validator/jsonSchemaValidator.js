export var deepcopy = function (target) {
    return isplainobject(target) ? $extend({}, target) : Array.isArray(target) ? target.map(deepcopy) : target
}

export var isplainobject = function (obj) {
    // Not plain objects:
    // - Any object or value whose internal [[Class]] property is not "[object Object]"
    // - DOM nodes
    // - window

    if (obj === null) {
        return false
    }

    if (typeof obj !== 'object' || obj.nodeType || (obj === obj.window)) {
        return false
    }

    if (obj.constructor && !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
        return false
    }

    // If the function hasn't returned already, we're confident that
    // |obj| is a plain object, created by {} or constructed with new Object
    return true
}

export const Validator = Class.extend({
    validate: function (value) {
        return this._validateSchema(this.schema, value)
    },
    extend : function (destination) {
        var source, i, property
        for (i = 1; i < arguments.length; i++) {
            source = arguments[i]
            for (property in source) {
                if (!source.hasOwnProperty(property)) continue
                if (source[property] && isplainobject(source[property])) {
                    if (!destination.hasOwnProperty(property)) destination[property] = {}
                    this.extend(destination[property], source[property])
                } else if (Array.isArray(source[property])) {
                    destination[property] = deepcopy(source[property])
                } else {
                    destination[property] = source[property]
                }
            }
        }
        return destination
    },
    expandRefs: function (schema){
        const _schema = this.extend({}, schema)
        if (!_schema.$ref) return _schema

        const refObj = this.refs_with_info[_schema.$ref]
        delete _schema.$ref
        const fetchUrl = refObj.$ref.startsWith('#')
            ? refObj.fetchUrl
            : ''
        const ref = this._getRef(fetchUrl, refObj)
        if (!this.refs[ref]) { // if reference not found
            console.warn("reference:'" + ref + "' not found!")
        } else if (recurseAllOf && this.refs[ref].hasOwnProperty('allOf')) {
            const allOf = this.refs[ref].allOf
            Object.keys(allOf).forEach(key => {
                allOf[key] = this.expandRefs(allOf[key], true)
            })
        }
        return this.extendSchemas(_schema, this.expandSchema(this.refs[ref]))
    },
    _validateSchema: function (schema, value, path) {
        const errors = []
        path = path || 'root'

        // Work on a copy of the schema
        schema = this.extend({}, this.expandRefs(schema))

        if (typeof value === 'undefined') {
            return [{
                path: path,
                property: 'required',
                message: this.translate('error_notset')
            }];
        }

        Object.keys(schema).forEach(key => {
            if (this._validateSubSchema[key]) {
                errors.push(...this._validateSubSchema[key].call(this, schema, value, path))
            }
        })

        /*
         * Type Specific Validation
         */
        errors.push(...this._validateByValueType(schema, value, path))

        if (schema.links) {
            schema.links.forEach((s, m) => {
                if (s.rel && s.rel.toLowerCase() === 'describedby') {
                    schema = this._expandSchemaLink(schema, m)
                    errors.push(...this._validateSchema(schema, value, path, this.translate))
                }
            })
        }

        // date, time and datetime-local validation
        if (['date', 'time', 'datetime-local'].indexOf(schema.format) !== -1) {
            errors.push(...this._validateDateTimeSubSchema(schema, value, path))
        }

        // custom validator
        errors.push(...this._validateCustomValidator(schema, value, path))

        // Remove duplicate errors and add "errorcount" property
        return this._removeDuplicateErrors(errors)
    },
    _validateSubSchema: {
        enum: function (schema, value, path) {
            const stringified = JSON.stringify(value)
            const valid = schema.enum.some(e => stringified === JSON.stringify(e))
            if (!valid) {
                return [{
                    path: path,
                    property: 'enum',
                    message: this.translate('error_enum')
                }]
            }
            return []
        },
        extends: function (schema, value, path) {
            const validate = (errors, e) => {
                errors.push(...this._validateSchema(e, value, path))
                return errors
            }
            return schema.extends.reduce(validate, [])
        },
        allOf: function (schema, value, path) {
            const validate = (errors, e) => {
                errors.push(...this._validateSchema(e, value, path))
                return errors
            }
            return schema.allOf.reduce(validate, [])
        },
        anyOf: function (schema, value, path) {
            const valid = schema.anyOf.some(e => !this._validateSchema(e, value, path).length)
            if (!valid) {
                return [{
                    path: path,
                    property: 'anyOf',
                    message: this.translate('error_anyOf')
                }]
            }
            return []
        },
        oneOf: function (schema, value, path) {
            let valid = 0
            const oneofErrors = []
            schema.oneOf.forEach((o, i) => {
                // Set the error paths to be path.oneOf[i].rest.of.path
                const tmp = this._validateSchema(o, value, path)
                if (!tmp.length) {
                    valid++
                }

                tmp.forEach(e => {
                    e.path = `${path}.oneOf[${i}]${e.path.substr(path.length)}`
                })
                oneofErrors.push(...tmp)
            })
            const errors = []
            if (valid !== 1) {
                errors.push({
                    path: path,
                    property: 'oneOf',
                    message: this.translate('error_oneOf', [valid])
                })
                errors.push(...oneofErrors)
            }
            return errors
        },
        not: function (schema, value, path) {
            if (!this._validateSchema(schema.not, value, path).length) {
                return [{
                    path: path,
                    property: 'not',
                    message: this.translate('error_not')
                }]
            }
            return []
        },
        type: function (schema, value, path) {
            // Union type
            if (Array.isArray(schema.type)) {
                const valid = schema.type.some(e => this._checkType(e, value))
                if (!valid) {
                    return [{
                        path: path,
                        property: 'type',
                        message: this.translate('error_type_union')
                    }]
                }
            } else {
                // Simple type
                if (['date', 'time', 'datetime-local'].indexOf(schema.format) !== -1 && schema.type === 'integer') {
                    // Hack to get validator to validate as string even if value is integer
                    // As validation of 'date', 'time', 'datetime-local' is done in separate validator
                    if (!this._checkType('string', '' + value)) {
                        return [{
                            path: path,
                            property: 'type',
                            message: this.translate('error_type', [schema.format])
                        }]
                    }
                } else if (!this._checkType(schema.type, value)) {
                    return [{
                        path: path,
                        property: 'type',
                        message: this.translate('error_type', [schema.type])
                    }]
                }
            }
            return []
        },
        disallow: function (schema, value, path) {
            // Union type
            if (Array.isArray(schema.disallow)) {
                const invalid = schema.disallow.some(e => this._checkType(e, value))
                if (invalid) {
                    return [{
                        path: path,
                        property: 'disallow',
                        message: this.translate('error_disallow_union')
                    }]
                }
            } else {
                // Simple type
                if (this._checkType(schema.disallow, value)) {
                    return [{
                        path: path,
                        property: 'disallow',
                        message: this.translate('error_disallow', [schema.disallow])
                    }]
                }
            }
            return []
        }
    },
    _validateDateTimeSubSchema: function (schema, value, path) {
        const _validateInteger = (schema, value, path) => {
            // The value is a timestamp
            if (value * 1 < 1) {
                // If value is less than 1, then it's an invalid epoch date before 00:00:00 UTC Thursday, 1 January 1970
                return [{
                    path: path,
                    property: 'format',
                    message: this.translate('error_invalid_epoch')
                }]
            } else if (value !== Math.abs(parseInt(value))) {
                // not much to check for, so we assume value is ok if it's a positive number
                return [{
                    path: path,
                    property: 'format',
                    message: this.translate('error_' + schema.format.replace(/-/g, '_'), [dateFormat])
                }]
            }
            return []
        }
        const _validateFlatPicker = (schema, value, path, editor) => {
            if (value !== '') {
                let compareValue
                if (editor.flatpickr.config.mode !== 'single') {
                    const seperator = editor.flatpickr.config.mode === 'range' ? editor.flatpickr.l10n.rangeSeparator : ', '
                    const selectedDates = editor.flatpickr.selectedDates.map(val =>
                        editor.flatpickr.formatDate(val, editor.flatpickr.config.dateFormat)
                    )
                    compareValue = selectedDates.join(seperator)
                }

                try {
                    if (compareValue) {
                        // Not the best validation method, but range and multiple mode are special
                        // Optimal solution would be if it is possible to change the return format from string/integer to array
                        if (compareValue !== value) throw new Error(editor.flatpickr.config.mode + ' mismatch')
                    } else if (editor.flatpickr.formatDate(editor.flatpickr.parseDate(value, editor.flatpickr.config.dateFormat), editor.flatpickr.config.dateFormat) !== value) {
                        throw new Error('mismatch')
                    }
                } catch (err) {
                    const errorDateFormat = editor.flatpickr.config.errorDateFormat !== undefined ? editor.flatpickr.config.errorDateFormat : editor.flatpickr.config.dateFormat
                    return [{
                        path: path,
                        property: 'format',
                        message: this.translate('error_' + editor.format.replace(/-/g, '_'), [errorDateFormat])
                    }]
                }
            }
            return []
        }

        const validatorRx = {
            'date': /^(\d{4}\D\d{2}\D\d{2})?$/,
            'time': /^(\d{2}:\d{2}(?::\d{2})?)?$/,
            'datetime-local': /^(\d{4}\D\d{2}\D\d{2}[ T]\d{2}:\d{2}(?::\d{2})?)?$/
        }
        const format = {
            'date': '"YYYY-MM-DD"',
            'time': '"HH:MM"',
            'datetime-local': '"YYYY-MM-DD HH:MM"'
        }

        const editor = this.jsoneditor.getEditor(path)
        const dateFormat = (editor && editor.flatpickr) ? editor.flatpickr.config.dateFormat : format[schema.format]

        if (schema.type === 'integer') {
            return _validateInteger(schema, value, path)
        } else if (!editor || !editor.flatpickr) {
            // Standard string input, without flatpickr
            if (!validatorRx[schema.format].test(value)) {
                return [{
                    path: path,
                    property: 'format',
                    message: this.translate('error_' + schema.format.replace(/-/g, '_'), [dateFormat])
                }]
            }
        } else if (editor) {
            // Flatpickr validation
            return _validateFlatPicker(schema, value, path, editor)
        }
        return []
    }
}

