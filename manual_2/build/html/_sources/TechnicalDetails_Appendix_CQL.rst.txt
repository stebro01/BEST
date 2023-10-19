
CQL - Descriptions and example rules
.....................................

CQL (Clinical Quality Language) is a standard for expressing clinical quality rules. It is a domain-specific language focused on clinical quality measurement, and is used to express logic used in quality measures, decision support rules, and clinical decision support rules.

Herein, CQL is interpreted using the library `cql-execution` and the `cql-to-elm` translator. The CQL is translated to ELM (Expression Logic Model) and then executed using the `cql-execution` library.

*Reference:*

- https://github.com/cqframework/cql-execution
- https://github.com/cqframework/cql-translation-service

The CQL is stored in the database as a string. The ELM is stored as a JSON string. The ELM is used for execution.



.. code-block:: JSON

    [
        {
            "CODE_CD": "numeric",
            "CQL_BLOB": null,
            "CQL_CHAR": "library NUMBER version '1'\\nparameter VALUE default 10.1\\ncontext Unfiltered\\ndefine NUMBER: VALUE >= 0",
            "CQL_ID": 1,
            "DOWNLOAD_DATE": null,
            "IMPORT_DATE": "2023-02-20 21:06:39",
            "JSON_CHAR": "{'library':{'annotation':[{'translatorOptions':'','type':'CqlToElmInfo'}],'identifier':{'id':'NUMBER','version':'1'},'schemaIdentifier':{'id':'urn:hl7-org:elm','version':'r1'},'usings':{'def':[{'localIdentifier':'System','uri':'urn:hl7-org:elm-types:r1'}]},'parameters':{'def':[{'name':'VALUE','accessLevel':'Public','default':{'valueType':'{urn:hl7-org:elm-types:r1}Decimal','value':'10.1','type':'Literal'}}]},'contexts':{'def':[{'name':'Unfiltered'}]},'statements':{'def':[{'name':'NUMBER','context':'Unfiltered','accessLevel':'Public','expression':{'type':'GreaterOrEqual','operand':[{'name':'VALUE','type':'ParameterRef'},{'type':'ToDecimal','operand':{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'0','type':'Literal'}}]}}]}}}",
            "NAME_CHAR": "Zahl",
            "UPDATE_DATE": null,
            "UPLOAD_ID": 79190712
        },
        {
            "CODE_CD": "string",
            "CQL_BLOB": null,
            "CQL_CHAR": "library TEXT version '1'\\nparameter VALUE default 'abc'\\ncontext Unfiltered\\ndefine TEXT: Length(VALUE) > 0",
            "CQL_ID": 2,
            "DOWNLOAD_DATE": null,
            "IMPORT_DATE": "2023-02-20 21:06:39",
            "JSON_CHAR": "{'library':{'annotation':[{'translatorOptions':'','type':'CqlToElmInfo'}],'identifier':{'id':'TEXT','version':'1'},'schemaIdentifier':{'id':'urn:hl7-org:elm','version':'r1'},'usings':{'def':[{'localIdentifier':'System','uri':'urn:hl7-org:elm-types:r1'}]},'parameters':{'def':[{'name':'VALUE','accessLevel':'Public','default':{'valueType':'{urn:hl7-org:elm-types:r1}String','value':'abc','type':'Literal'}}]},'contexts':{'def':[{'name':'Unfiltered'}]},'statements':{'def':[{'name':'TEXT','context':'Unfiltered','accessLevel':'Public','expression':{'type':'Greater','operand':[{'type':'Length','operand':{'name':'VALUE','type':'ParameterRef'}},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'0','type':'Literal'}]}}]}}}",
            "NAME_CHAR": "Texteingabe",
            "UPDATE_DATE": null,
            "UPLOAD_ID": 79190712
        },
        {
            "CODE_CD": "date",
            "CQL_BLOB": null,
            "CQL_CHAR": "library DATE version '1'\\nparameter VALUE default '2022-01-02'\\ncontext Unfiltered\\ndefine STRING: Length(VALUE) > 0\\ndefine SPLIT: Length(Split(VALUE, '-')) = 3\\ndefine SPLIT_1: Length(Split(VALUE, '-')[0]) = 4\\ndefine SPLIT_2: Length(Split(VALUE, '-')[1]) = 2\\ndefine SPLIT_3: Length(Split(VALUE, '-')[2]) = 2",
            "CQL_ID": 3,
            "DOWNLOAD_DATE": null,
            "IMPORT_DATE": "2023-02-14",
            "JSON_CHAR": "{'library':{'annotation':[{'translatorOptions':'','type':'CqlToElmInfo'}],'identifier':{'id':'DATE','version':'1'},'schemaIdentifier':{'id':'urn:hl7-org:elm','version':'r1'},'usings':{'def':[{'localIdentifier':'System','uri':'urn:hl7-org:elm-types:r1'}]},'parameters':{'def':[{'name':'VALUE','accessLevel':'Public','default':{'valueType':'{urn:hl7-org:elm-types:r1}String','value':'2022-01-02','type':'Literal'}}]},'contexts':{'def':[{'name':'Unfiltered'}]},'statements':{'def':[{'name':'STRING','context':'Unfiltered','accessLevel':'Public','expression':{'type':'Greater','operand':[{'type':'Length','operand':{'name':'VALUE','type':'ParameterRef'}},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'0','type':'Literal'}]}},{'name':'SPLIT','context':'Unfiltered','accessLevel':'Public','expression':{'type':'Equal','operand':[{'type':'Length','operand':{'type':'Split','stringToSplit':{'name':'VALUE','type':'ParameterRef'},'separator':{'valueType':'{urn:hl7-org:elm-types:r1}String','value':'-','type':'Literal'}}},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'3','type':'Literal'}]}},{'name':'SPLIT_1','context':'Unfiltered','accessLevel':'Public','expression':{'type':'Equal','operand':[{'type':'Length','operand':{'type':'Indexer','operand':[{'type':'Split','stringToSplit':{'name':'VALUE','type':'ParameterRef'},'separator':{'valueType':'{urn:hl7-org:elm-types:r1}String','value':'-','type':'Literal'}},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'0','type':'Literal'}]}},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'4','type':'Literal'}]}},{'name':'SPLIT_2','context':'Unfiltered','accessLevel':'Public','expression':{'type':'Equal','operand':[{'type':'Length','operand':{'type':'Indexer','operand':[{'type':'Split','stringToSplit':{'name':'VALUE','type':'ParameterRef'},'separator':{'valueType':'{urn:hl7-org:elm-types:r1}String','value':'-','type':'Literal'}},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'1','type':'Literal'}]}},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'2','type':'Literal'}]}},{'name':'SPLIT_3','context':'Unfiltered','accessLevel':'Public','expression':{'type':'Equal','operand':[{'type':'Length','operand':{'type':'Indexer','operand':[{'type':'Split','stringToSplit':{'name':'VALUE','type':'ParameterRef'},'separator':{'valueType':'{urn:hl7-org:elm-types:r1}String','value':'-','type':'Literal'}},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'2','type':'Literal'}]}},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'2','type':'Literal'}]}}]}}}",
            "NAME_CHAR": "Datumsformat",
            "UPDATE_DATE": null,
            "UPLOAD_ID": "sb"
        },
        {
            "CODE_CD": "blob",
            "CQL_BLOB": null,
            "CQL_CHAR": "library BLOB version '1'\\nparameter VALUE default 'abc'\\ncontext Unfiltered\\ndefine TEXT: Length(VALUE) > 0",
            "CQL_ID": 4,
            "DOWNLOAD_DATE": null,
            "IMPORT_DATE": "2023-02-20 21:22:24",
            "JSON_CHAR": "{'library':{'annotation':[{'translatorOptions':'','type':'CqlToElmInfo'}],'identifier':{'id':'BLOB','version':'1'},'schemaIdentifier':{'id':'urn:hl7-org:elm','version':'r1'},'usings':{'def':[{'localIdentifier':'System','uri':'urn:hl7-org:elm-types:r1'}]},'parameters':{'def':[{'name':'VALUE','accessLevel':'Public','default':{'valueType':'{urn:hl7-org:elm-types:r1}String','value':'abc','type':'Literal'}}]},'contexts':{'def':[{'name':'Unfiltered'}]},'statements':{'def':[{'name':'TEXT','context':'Unfiltered','accessLevel':'Public','expression':{'type':'Greater','operand':[{'type':'Length','operand':{'name':'VALUE','type':'ParameterRef'}},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'0','type':'Literal'}]}}]}}}",
            "NAME_CHAR": "BLOB Feld",
            "UPDATE_DATE": null,
            "UPLOAD_ID": 79190712
        },
        {
            "CODE_CD": "RANGE_0_30",
            "CQL_BLOB": null,
            "CQL_CHAR": "library RANGE_0_30 version '1'\\nparameter VALUE default 10\\ncontext Unfiltered\\ndefine RANGE: VALUE >= 0 and VALUE <= 30",
            "CQL_ID": 5,
            "DOWNLOAD_DATE": null,
            "IMPORT_DATE": "2023-02-25 09:04:32",
            "JSON_CHAR": "{'library':{'annotation':[{'translatorOptions':'','type':'CqlToElmInfo'}],'identifier':{'id':'RANGE_0_30','version':'1'},'schemaIdentifier':{'id':'urn:hl7-org:elm','version':'r1'},'usings':{'def':[{'localIdentifier':'System','uri':'urn:hl7-org:elm-types:r1'}]},'parameters':{'def':[{'name':'VALUE','accessLevel':'Public','default':{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'10','type':'Literal'}}]},'contexts':{'def':[{'name':'Unfiltered'}]},'statements':{'def':[{'name':'RANGE','context':'Unfiltered','accessLevel':'Public','expression':{'type':'And','operand':[{'type':'GreaterOrEqual','operand':[{'name':'VALUE','type':'ParameterRef'},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'0','type':'Literal'}]},{'type':'LessOrEqual','operand':[{'name':'VALUE','type':'ParameterRef'},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'30','type':'Literal'}]}]}}]}}}",
            "NAME_CHAR": "Zahl mit Wertebereich zw. 0 und 30",
            "UPDATE_DATE": null,
            "UPLOAD_ID": 79190712
        },
        {
            "CODE_CD": "age",
            "CQL_BLOB": "Werte zw. 0 und 140",
            "CQL_CHAR": "library age version '1'\\nparameter VALUE default 10\\ncontext Unfiltered\\ndefine AGE: VALUE >= 0 and VALUE < 140",
            "CQL_ID": 6,
            "DOWNLOAD_DATE": null,
            "IMPORT_DATE": "2023-02-27 20:53:14",
            "JSON_CHAR": "{'library':{'annotation':[{'translatorOptions':'','type':'CqlToElmInfo'}],'identifier':{'id':'age','version':'1'},'schemaIdentifier':{'id':'urn:hl7-org:elm','version':'r1'},'usings':{'def':[{'localIdentifier':'System','uri':'urn:hl7-org:elm-types:r1'}]},'parameters':{'def':[{'name':'VALUE','accessLevel':'Public','default':{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'10','type':'Literal'}}]},'contexts':{'def':[{'name':'Unfiltered'}]},'statements':{'def':[{'name':'AGE','context':'Unfiltered','accessLevel':'Public','expression':{'type':'And','operand':[{'type':'GreaterOrEqual','operand':[{'name':'VALUE','type':'ParameterRef'},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'0','type':'Literal'}]},{'type':'Less','operand':[{'name':'VALUE','type':'ParameterRef'},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'140','type':'Literal'}]}]}}]}}}",
            "NAME_CHAR": "Alter",
            "UPDATE_DATE": null,
            "UPLOAD_ID": 79190712
        },
        {
            "CODE_CD": "BIRTH_DATE",
            "CQL_BLOB": null,
            "CQL_CHAR": "library BIRTH_DATE version '1'\\nparameter VALUE default '1941-03-21'\\ncontext Unfiltered\\ndefine VALID: VALUE < '2025-12-12'\\n\\ndefine STRING: Length(VALUE) > 0\\ndefine SPLIT: Length(Split(VALUE, '-')) = 3\\ndefine SPLIT_1: Length(Split(VALUE, '-')[0]) = 4\\ndefine SPLIT_2: Length(Split(VALUE, '-')[1]) = 2\\ndefine SPLIT_3: Length(Split(VALUE, '-')[2]) = 2",
            "CQL_ID": 7,
            "DOWNLOAD_DATE": null,
            "IMPORT_DATE": "2023-03-09 12:16:34",
            "JSON_CHAR": "{'library':{'annotation':[{'translatorOptions':'','type':'CqlToElmInfo'}],'identifier':{'id':'BIRTH_DATE','version':'1'},'schemaIdentifier':{'id':'urn:hl7-org:elm','version':'r1'},'usings':{'def':[{'localIdentifier':'System','uri':'urn:hl7-org:elm-types:r1'}]},'parameters':{'def':[{'name':'VALUE','accessLevel':'Public','default':{'valueType':'{urn:hl7-org:elm-types:r1}String','value':'1941-03-21','type':'Literal'}}]},'contexts':{'def':[{'name':'Unfiltered'}]},'statements':{'def':[{'name':'VALID','context':'Unfiltered','accessLevel':'Public','expression':{'type':'Less','operand':[{'name':'VALUE','type':'ParameterRef'},{'valueType':'{urn:hl7-org:elm-types:r1}String','value':'2025-12-12','type':'Literal'}]}},{'name':'STRING','context':'Unfiltered','accessLevel':'Public','expression':{'type':'Greater','operand':[{'type':'Length','operand':{'name':'VALUE','type':'ParameterRef'}},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'0','type':'Literal'}]}},{'name':'SPLIT','context':'Unfiltered','accessLevel':'Public','expression':{'type':'Equal','operand':[{'type':'Length','operand':{'type':'Split','stringToSplit':{'name':'VALUE','type':'ParameterRef'},'separator':{'valueType':'{urn:hl7-org:elm-types:r1}String','value':'-','type':'Literal'}}},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'3','type':'Literal'}]}},{'name':'SPLIT_1','context':'Unfiltered','accessLevel':'Public','expression':{'type':'Equal','operand':[{'type':'Length','operand':{'type':'Indexer','operand':[{'type':'Split','stringToSplit':{'name':'VALUE','type':'ParameterRef'},'separator':{'valueType':'{urn:hl7-org:elm-types:r1}String','value':'-','type':'Literal'}},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'0','type':'Literal'}]}},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'4','type':'Literal'}]}},{'name':'SPLIT_2','context':'Unfiltered','accessLevel':'Public','expression':{'type':'Equal','operand':[{'type':'Length','operand':{'type':'Indexer','operand':[{'type':'Split','stringToSplit':{'name':'VALUE','type':'ParameterRef'},'separator':{'valueType':'{urn:hl7-org:elm-types:r1}String','value':'-','type':'Literal'}},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'1','type':'Literal'}]}},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'2','type':'Literal'}]}},{'name':'SPLIT_3','context':'Unfiltered','accessLevel':'Public','expression':{'type':'Equal','operand':[{'type':'Length','operand':{'type':'Indexer','operand':[{'type':'Split','stringToSplit':{'name':'VALUE','type':'ParameterRef'},'separator':{'valueType':'{urn:hl7-org:elm-types:r1}String','value':'-','type':'Literal'}},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'2','type':'Literal'}]}},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'2','type':'Literal'}]}}]}}}",
            "NAME_CHAR": "Geburtsdatum",
            "UPDATE_DATE": null,
            "UPLOAD_ID": 79190712
        },
        {
            "CODE_CD": "RANGE_0_to_6",
            "CQL_BLOB": null,
            "CQL_CHAR": "library RANGE_0_to_6 version '1'\\nparameter VALUE default 0\\ncontext Unfiltered\\ndefine AGE: VALUE >= 0 and VALUE < 7",
            "CQL_ID": 8,
            "DOWNLOAD_DATE": null,
            "IMPORT_DATE": "2023-05-31 11:14:00",
            "JSON_CHAR": "{'library':{'annotation':[{'translatorOptions':'','type':'CqlToElmInfo'}],'identifier':{'id':'RANGE_0_to_6','version':'1'},'schemaIdentifier':{'id':'urn:hl7-org:elm','version':'r1'},'usings':{'def':[{'localIdentifier':'System','uri':'urn:hl7-org:elm-types:r1'}]},'parameters':{'def':[{'name':'VALUE','accessLevel':'Public','default':{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'0','type':'Literal'}}]},'contexts':{'def':[{'name':'Unfiltered'}]},'statements':{'def':[{'name':'AGE','context':'Unfiltered','accessLevel':'Public','expression':{'type':'And','operand':[{'type':'GreaterOrEqual','operand':[{'name':'VALUE','type':'ParameterRef'},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'0','type':'Literal'}]},{'type':'Less','operand':[{'name':'VALUE','type':'ParameterRef'},{'valueType':'{urn:hl7-org:elm-types:r1}Integer','value':'7','type':'Literal'}]}]}}]}}}",
            "NAME_CHAR": "Der Wert darf nur zwischen 0 und 6 sein",
            "UPDATE_DATE": null,
            "UPLOAD_ID": 79190712
        }
    ]