/**
 * mahdieh Akbari
 *

 */


class PriceEstimate {
    constructor(options){
        // ------------- Pickup
        this.PickupInput = options.PickupInput;
        this.PickupClearBtn = options.PickupClearBtn;
        this.PointIcon = options.PointIcon;

        // ------------- Drop Off
        this.DropoffInput = options.DropoffInput
        this.DropoffClearBtn = options.DropoffClearBtn;

        // ------------- Buttons
        this.CalcBtn = options.CalcBtn;
        this.RequestBtn = options.RequestBtn;

        // ------------- Result
        this.ResultDiv = options.ResultDiv

        // ------------- URL
        this.ApiUrl = options.ApiUrl;
        this.ApiHavToken = (options.ApiHavToken === undefined) ? false : options.ApiHavToken;

        // ------------- MAP
        this.MapDiv=(options.MapDiv === undefined) ? '' : options.MapDiv;

        this.options = { componentRestrictions: { country: "gb" }, fields: ["address_components", "geometry", "name"], types: ["establishment"] };
        this.pickup = { lat: 0, long: 0 },
        this.dropoff = { lat: 0, long: 0 };

        this.init();
    }

    initAutocomplete(o, e) {
        let n = document.querySelector(o),
            t = new google.maps.places.Autocomplete(n, this.options);
        t.addListener("place_changed", () => {
            const o = t.getPlace();
            (e.lat = o.geometry.location.lat()), (e.long = o.geometry.location.lng());
        });
    };

    // ------------------------------------------------------------------------------ Pickup


    init(){
        this.initAutocomplete(this.PickupInput, this.pickup);
        this.initAutocomplete(this.DropoffInput, this.dropoff);
        this.Events();
    }

    Events() {
        // ------------------------------------------------------------------------------ Pickup
        document.querySelector(this.PickupInput).addEventListener("keypress", function () {
            document.querySelector(this.PickupClearBtn).classList.remove("d-none");
        });
        /*$(this.PickupInput).on("keypress", function () {
            $(this.PickupClearBtn).removeClass("d-none");
        })*/
        document.querySelector(this.PickupInput).addEventListener("keyup", function () {
            if("" === document.querySelector(this.PickupInput).value()) {
                document.querySelector(this.RequestBtn).classList.add("d-none");
                document.querySelector(this.CalcBtn).classList.remove("d-none");
                document.querySelector(this.ResultDiv).classList.empty();
            }

        });
        // $(this.PickupInput).on("keyup", function () {
        //     "" == $(this).val() && ($(this.RequestBtn).addClass("d-none"),
        //         $(this.CalcBtn).removeClass("d-none"),
        //         $(this.ResultDiv).empty())
        // })
        document.querySelector(this.PickupClearBtn).addEventListener("click", function () {
            document.querySelector(this.PickupInput).val("")
            document.querySelector(this.CalcBtn).classList.remove("d-none")
            document.querySelector(this.ResultDiv).classList.empty()
        })
        // $(this.PickupClearBtn).on("click", function () {
        //     $(this.PickupInput).val("");
        // })

        // $(this.PickupClearBtn).on("click", function () {
        //     $(this.CalcBtn).removeClass("d-none");
        //     $(this.RequestBtn).addClass("d-none");
        //     $(this.ResultDiv).empty();
        // })

        // ------------------------------------------------------------------------------ Drop Off
        document.querySelector(this.DropoffInput).addEventListener("keypress", function () {
            document.querySelector(this.DropoffClearBtn).classList.remove("d-none")
        })
        // $(this.DropoffInput).on("keypress", function () {
        //     $(this.DropoffClearBtn).removeClass("d-none");
        // })
        document.querySelector(this.DropoffInput).addEventListener("keyup", function () {
            if("" === document.querySelector(this.DropoffInput).value()) {
                document.querySelector(this.RequestBtn).classList.add("d-none");
                document.querySelector(this.CalcBtn).classList.remove("d-none");
                document.querySelector(this.ResultDiv).classList.empty();
            }
        })
        // $(this.DropoffInput).on("keyup", function () {
        //     "" == $(this).val() && ($("#btn-req").addClass("d-none"),
        //         $(this.CalcBtn).removeClass("d-none"),
        //         $(this.ResultDiv).empty());
        // });

        document.querySelector(this.DropoffClearBtn).addEventListener("click", function () {
            document.querySelector(this.DropoffInput).val("");
        })

        // $(this.DropoffClearBtn).on("click", function () {
        //     $(this.DropoffInput).val("");
        // })
        document.querySelector(this.DropoffClearBtn).addEventListener("click", function () {
            document.querySelector(this.CalcBtn).classList.remove("d-none");
            document.querySelector(this.RequestBtn).classList.add("d-none");
            document.querySelector(this.ResultDiv).classList.empty();
        })
        // $(this.DropoffClearBtn).on("click", function () {
        //     $(this.CalcBtn).removeClass("d-none");
        //     $(this.RequestBtn).addClass("d-none");
        //     $(this.ResultDiv).empty();
        // })


        // ------------------------------------------------------------------------------ Other
        document.querySelector(this.CalcBtn).addEventListener("click", function () {
            //this.SendAjax();

            let url = this.ApiUrl;
            if (this.ApiHavToken){
                url += CryptoJS.MD5([this.pickup.lat, this.pickup.long, this.dropoff.lat, this.dropoff.long].join("")).toString();
            }
            $.ajax({
                type: "POST",
                url: url,
                data: { origin_lat: this.pickup.lat, origin_long: this.pickup.long, destination_lat: this.dropoff.lat, destination_long: this.dropoff.long },
                dataType: "json",
                success: function (e) {
                    let n = "";
                },
                error: function (o) {
                    console.log(o);
                },
            });
        });
    }

    SendAjax (){
        let url = this.ApiUrl;
        if (this.ApiHavToken){
            url += CryptoJS.MD5([this.pickup.lat, this.pickup.long, this.dropoff.lat, this.dropoff.long].join("")).toString();
        }
        $.ajax({
            type: "POST",
            url: url,
            data: { origin_lat: this.pickup.lat, origin_long: this.pickup.long, destination_lat: this.dropoff.lat, destination_long: this.dropoff.long },
            dataType: "json",
            success: function (e) {
                let n = "";
                if ("success" === e.status)
                    e.data.results.forEach((o) => {
                        n += `\n <li>\n <div class="d-flex justify-content-between">\n ${o.vehicle}\n <span>${o.symbole} ${o.price}</span>\n                                </div>\n                            </li>\n                            `;
                    }),
                        (document.querySelector(this.ResultDiv).innerHTML = n),
                        $(this.PickupInput).css("border-color", "#C4C4C4"),
                        $(this.PointIcon).css("border-color", "#C4C4C4"),
                        $(this.CalcBtn).addClass("d-none"),
                        $(this.RequestBtn).removeClass("d-none");
                else {
                    let n = document.querySelector(".ul-vehicle");
                    (n.innerHTML = e.message),
                        (n.style.color = "red"),
                        $(this.DropoffInput).css("border-color", "red"),
                        $(this.PointIcon).css("border-color", "red"),
                        $(this.CalcBtn).removeClass("d-none"),
                        $(this.RequestBtn).addClass("d-none");
                }
            },
            error: function (o) {
                console.log(o);
            },
        });
    }
}