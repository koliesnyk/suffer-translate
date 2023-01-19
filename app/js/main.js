$(document).ready(function () {
  $(".generate-code").click(function (e) {
    e.preventDefault();

    generateCode();
  });

  $(document).on("click", ".remove", function (e) {
    e.preventDefault();

    $(this).parent().remove();
  });

  $(".add-fields").click(function (e) {
    e.preventDefault();

    addField();
  });
});

function addField() {
  var fields = `
    <div class="fieldset">
      <input type="text" name="caption" placeholder="Enter Caption" />
      <input type="text" name="text" placeholder="Enter Text" />
      <input type="text" name="translate" placeholder="Enter Translation" />
      <button class="remove">Remove</button>
    </div>
  `;

  $(".fields").append(fields);
}

function createGuid() {
  function _p8(s) {
    var p = (Math.random().toString(16) + "000000000").substr(2, 8);
    return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
  }
  return _p8() + _p8(true) + _p8(true) + _p8();
}

function generateCode() {
  var result = "";
  var fieldsResult = "";
  var translateResults = "";

  var className = $("input[name=class-name]").val();

  $(".fields .fieldset").each(function (index) {
    var caption = $(this).find("input[name=caption]").val();
    var text = $(this).find("input[name=text]").val();
    var translate = $(this).find("input[name=translate]").val();
    var stringName = caption.replace(/\s/g, "");

    fieldsResult += `
      [Ordinal(${index + 1})]
      [ID("{${createGuid()}}")]
      [Caption("${caption} Text Caption")]
      [Access(AccessLevel.System)]
      public MetaStoreString ${stringName}Caption { get; set; } = new("${text}");
    `;

    translateResults += `
      ${stringName}Caption.SetRootValueByLanguage("${translate}", "de-DE");
    `;
  });

  result = `
    public class ${className} : MetaStoreContainer
    {
        ${fieldsResult}

        public Dictionary<int, MetaStoreString> Folders { get; set; } = new Dictionary<int, MetaStoreString>();

        public override async ValueTask<OpResult> InitializeNodeAsync(IMetaStoreContext context, bool forceInit = false)
        {
            await base.InitializeNodeAsync(context);
            ${translateResults}
            return OpStatus.OK;
        }
    }
  `;

  $(".result-section").removeClass("hidden");
  $(".code").html(result);

  console.log(result);
}
