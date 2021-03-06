import {makeSentenceCase} from '../string/string';
import stache from 'can-stache';
import DefineMap from 'can-define/map/map';
import DefineList from 'can-define/list/list';
import dev from 'can-util/js/dev/dev';

/**
 * Built in field templates. If `fieldType` is specified on a field, the
 * template listed here will be used. Otherwise, `formTemplate` should be
 * provided for custom field templates.
 *  - text: `<text-field />` component
 *  - select: `<select-field />` component
 *  - file: `<file-field />` component
 *  - json: `<json-field />` component
 *  - subform: `<subform-field />` component
 *  - date: `<date-field />` component
 *  - checkbox: `<checkbox-field />` component
 * @property {Object} util/field/Field.TEMPLATES Built-in Templates
 * @parent util/field.guides
 */
export const TEMPLATES = {
    text: stache('<text-field vm:properties:from="." on:vm:fieldchange="setField" value="{{formObject[name]}}" vm:errors:from="validationErrors" />'), // string
    select: stache('<select-field vm:properties:from="." on:vm:fieldchange="setField" value="{{formObject[name]}}" vm:errors:from="validationErrors" />'), // string
    file: stache('<file-field vm:properties:from="." on:vm:fieldchange="setField" vm:value:from="formObject[name]" vm:errors:from="validationErrors" />'), // string
    json: stache('<json-field vm:properties:from="." on:vm:fieldchange="setField" vm:value:from="formObject[name]" vm:errors:from="validationErrors" />'), // string
    subform: stache('<subform-field vm:properties:from="." on:vm:fieldchange="setField" vm:value:from="formObject[name]" vm:errors:from="validationErrors" />'), // string
    date: stache('<date-field vm:properties:from="." on:vm:fieldchange="setField" vm:value:from="formObject[name]" vm:errors:from="validationErrors" />'), // date object
    checkbox: stache('<checkbox-field on:vm:fieldchange="setField" value="{{formObject[name]}}" vm:errors:from="validationErrors" vm:properties:from="." />')
};

const displayTemplate = stache('{{object[field.name]}}');

/**
 * @constructor util/field/Field Field
 * @parent util/field
 * @group util/field/Field.props Properties
 * @description Constructs a new field
 */
export const Field = DefineMap.extend('Field', {

    // allow extra properties on this type
    seal: false
}, {
    /**
     * @prototype
     */
    /**
     * The name of the property on the object, this field's name
     * @property {String} util/field/Field.props.name name
     * @parent util/field/Field.props
     */
    name: 'string',
    /**
     * A friendly name for the field used to display to the user
     * The default is to capitalize the name and remove underscores
     * @property {String} util/field/Field.props.alias alias
     * @parent util/field/Field.props
     */
    alias: {
        type: 'string',
        get (alias) {
            if (alias) {
                return alias;
            }
            return makeSentenceCase(this.name);
        }
    },
    /**
     * The type of the form field to use when editing this field. These types
     * are defined in the `util/field.TEMPLATES` constant. This should be
     * omitted if a custom template is used.
     * @property {String} util/field/Field.props.fieldType fieldType
     * @parent util/field/Field.props
     */
    fieldType: {
        type: 'string',
        value: 'text'
    },
    /**
     * The form field template to use when editing this field in the form-widget. This should be
     * a template renderer. By default, this value is set to the
     * template for the given `fieldType` property.
     *
     * The default renderers are provided as a constant, and may be referenced
     * by passing the `field.fieldType` parameter. For instance, passing
     * `fieldType: 'select'` will set `formTemplate` to the registered
     * template for a `select-field` component.
     *
     * Custom templates can be created to add various field types and functionality
     * to the form widget.
     *
     * The custom templates will have the following useful properties in their scope:
     *  - `this`: (alias `.` is the current `this` object) the field properties object
     *  - `setField`: the function to call when the field changes
     *  - `formObject`: the form object
     *  - `validationErrors`: An object with keys referencing the field name, and a string referencing a validation error
     *
     * For example:
     * @property {Renderer} util/field/Field.props.formTemplate formTemplate
     * @parent util/field/Field.props
     */
    formTemplate: {
        type: '*',
        get (template) {
            if (template) {
                if (typeof template === 'string') {
                    template = stache(template);
                }
                return template;
            }
            const fType = this.fieldType;
            if (!TEMPLATES.hasOwnProperty(fType)) {
                dev.warn('No template for the given field type', fType);
                return TEMPLATES.text;
            }
            return TEMPLATES[fType];
        }
    },
    /**
     * @body
     * Formats the field into a renderer in the list and details view of the
     * data-admin component. The renderer has the scope of the
     * list-table or property table. The simplest displayTemplate value would be
     * the default, which is `object[field.name]`. (make sure to surround values with brackets)
     *
     * In this example,
     * the scope of the table components provide access to each row as `object` and the
     * current field as `field`.
     *
     * In addition, other properties can be accessed and combined by providing it
     * `{{object.other_prop_name}}`. Custom helpers and other methods may also be
     * registered and utilized. For instance, if we created a global helper
     * `capitalize(property)` we could access it with `capitalize object.prop_name`.
     *
     * For a local helper, an additional method could be added to the field, like
     * ```javascript
     * {
     * name: 'prop',
     * alias: 'Property',
     * capitalize: function(val){
     *     return val.toUpperCase();
     * }
     * }
     * ```
     *
     * In a stache template, this could be rendered using `field.capitalize(object.prop)`
     * @property {Renderer} util/field/Field.props.displayTemlpate displayTemplate
     * @parent util/field/Field.props
     */
    displayTemplate: {
        value: function () {
            return displayTemplate;
        },
        type (val) {
            if (typeof val === 'string') {
                return stache(val);
            }
            return val;
        }
    },
    /**
     * Includes this field in the list view in the data-admin
     * @property {Boolean} util/field/Field.props.list list
     * @parent util/field/Field.props
     */
    list: {
        type: 'boolean',
        value: true
    },
    /**
     * Includes this field in the details view in the data-admin
     * @property {Boolean} util/field/Field.props.detail detail
     * @parent util/field/Field.props
     */
    detail: {
        type: 'boolean',
        value: true
    },
    /**
     * Includes this field in the edit view in the data-admin
     * @property {Boolean} util/field/Field.props.edit edit
     * @parent util/field/Field.props
     */
    edit: {
        type: 'boolean',
        value: true
    },
    /**
     * Includes this field in the filter widget's fields.
     * @property {Boolean} util/field/Field.props.filter filter
     * @parent util/field/Field.props
     */
    filter: {
        type: 'boolean',
        value: true
    },
    /**
     * Includes this field in the sorting capability
     * @property {Boolean} util/field/Field.props.sort sort
     * @parent util/field/Field.props
     */
    sort: {
        type: 'boolean',
        value: true
    },
    /**
     * Validates a property and returns a string if the field is invalid
     * @property {Function} util/field/Field.props.validate validate
     * @signature `validate(props)`
     * @param {util/field.ValidationObject} props A special object consisting of information about the current value and dirty state of the form object
     * @return {String|falsey} a string error message if the value is not valid or undefined if there is no error message
     * @parent util/field/Field.props
     */
    validate: {
        value: null
    },
    /**
     * A boolean flag to display form field inline with others and hide labels
     * @property {Boolean} util/field/Field.props.inline inline
     * @parent util/field/Field.props
     */
    inline: 'boolean',
    /**
     * Text to display when the field is empty (like a textbox). Doesn't apply to
     * some fields, like select or date fields.
     * @property {String} util/field/Field.props.placeholder placeholder
     * @parent util/field/Field.props
     */
    placeholder: 'string',
    /**
     * Adds css classes to the table cells and headings. Selectors should use
     * `th.classname` and `td.classname`
     * @property {String} util/field/Field.props.classes classes
     * @parent util/field/Field.props
     */
    classes: 'string'
});


export const FieldList = DefineList.extend('FieldList', {
    '#': Field
});

export default Field;
