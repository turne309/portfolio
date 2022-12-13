// Mouse Circle
const mouseCircle = document.querySelector(".mouse-circle");
const mouseDot = document.querySelector(".mouse-dot");

let mouseCircleBool = true;

const mouseCircleFn = (x, y) => {
  mouseCircleBool &&
    (mouseCircle.style.cssText = `top: ${y}px; left: ${x}px; opacity: 1`);

  mouseDot.style.cssText = `top: ${y}px; left: ${x}px; opacity: 1`;
};
// End of Mouse Circle

// Animated Circles
const circles = document.querySelectorAll(".circle");
const mainImg = document.querySelector(".main-circle img");

let mX = 0;
let mY = 0;
const z = 100;

const animateCircles = (e, x, y) => {
  if (x < mX) {
    circles.forEach((circle) => {
      circle.style.left = `${z}px`;
    });
    mainImg.style.left = `${z}px`;
  } else if (x > mX) {
    circles.forEach((circle) => {
      circle.style.left = `-${z}px`;
    });
    mainImg.style.left = `-${z}px`;
  }

  if (y < mY) {
    circles.forEach((circle) => {
      circle.style.top = `${z}px`;
    });
    mainImg.style.top = `${z}px`;
  } else if (y > mY) {
    circles.forEach((circle) => {
      circle.style.top = `-${z}px`;
    });
    mainImg.style.top = `-${z}px`;
  }

  mX = e.clientX;
  mY = e.clientY;
};
// End of Animated Circles

let hoveredElPosition = [];

const stickyElement = (x, y, hoveredEl) => {
  // Sticky Element
  if (hoveredEl.classList.contains("sticky")) {
    hoveredElPosition.length < 1 &&
      (hoveredElPosition = [hoveredEl.offsetTop, hoveredEl.offsetLeft]);

    hoveredEl.style.cssText = `top: ${y}px; left: ${x}px`;

    if (
      hoveredEl.offsetTop <= hoveredElPosition[0] - 100 ||
      hoveredEl.offsetTop >= hoveredElPosition[0] + 100 ||
      hoveredEl.offsetLeft <= hoveredElPosition[1] - 100 ||
      hoveredEl.offsetLeft >= hoveredElPosition[1] + 100
    ) {
      hoveredEl.style.cssText = "";
      hoveredElPosition = [];
    }

    hoveredEl.onmouseleave = () => {
      hoveredEl.style.cssText = "";
      hoveredElPosition = [];
    };
  }
  // End of Sticky Element
};

// Mouse Circle Transform
const mouseCircleTransform = (hoveredEl) => {
  if (hoveredEl.classList.contains("pointer-enter")) {
    hoveredEl.onmousemove = () => {
      mouseCircleBool = false;
      mouseCircle.style.cssText = `
      width: ${hoveredEl.getBoundingClientRect().width}px;
      height: ${hoveredEl.getBoundingClientRect().height}px;
      top: ${hoveredEl.getBoundingClientRect().top}px;
      left: ${hoveredEl.getBoundingClientRect().left}px;
      opacity: 1;
      transform: translate(0, 0);
      animation: none;
      border-radius: ${getComputedStyle(hoveredEl).borderBottomLeftRadius};
      transition: width .5s, height .5s, top .5s, left .5s, transform .5s, border-radius .5s;
      `;
    };

    hoveredEl.onmouseleave = () => {
      mouseCircleBool = true;
    };

    document.onscroll = () => {
      if (!mouseCircleBool) {
        mouseCircle.style.top = `${hoveredEl.getBoundingClientRect().top}px`;
      }
    };
  }
};
// End of Mouse Circle Transform

document.body.addEventListener("mousemove", (e) => {
  let x = e.clientX;
  let y = e.clientY;

  mouseCircleFn(x, y);
  animateCircles(e, x, y);

  const hoveredEl = document.elementFromPoint(x, y);
  stickyElement(x, y, hoveredEl);
  mouseCircleTransform(hoveredEl);
});

document.body.addEventListener("mouseleave", () => {
  mouseCircle.style.opacity = "0";
  mouseDot.style.opacity = "0";
});

// Main Button
const mainBtns = document.querySelectorAll(".main-btn");

mainBtns.forEach((btn) => {
  let ripple;

  btn.addEventListener("mouseenter", (e) => {
    console.log("hi");
    const left = e.clientX - e.target.getBoundingClientRect().left;
    const top = e.clientY - e.target.getBoundingClientRect().top;

    ripple = document.createElement("div");
    ripple.classList.add("ripple");
    ripple.style.left = `${left}px`;
    ripple.style.top = `${top}px`;
    btn.prepend(ripple);
  });

  btn.addEventListener("mouseleave", () => {
    btn.removeChild(ripple);
  });
});

// End of Main Button

// Progress Bar
const sections = document.querySelectorAll("section");
const progressBar = document.querySelector(".progress-bar");
const halfCircles = document.querySelectorAll(".half-circle");
const halfCircleTop = document.querySelector(".half-circle-top");
const progressBarCircle = document.querySelector(".progress-bar-circle");

let scrolledPortion = 0;
let scrollBool = false;
let imageWrapper = false;

const progressBarFn = (bigImgWrapper) => {
  imageWrapper = bigImgWrapper;
  let pageHeight = 0;
  const pageViewportHeight = window.innerHeight;

  if (!imageWrapper) {
    pageHeight = document.documentElement.scrollHeight;
    scrolledPortion = window.pageYOffset;
  } else {
    pageHeight = imageWrapper.firstElementChild.scrollHeight;
    scrolledPortion = imageWrapper.scrollTop;
  }

  const scrolledPortionDegree =
    (scrolledPortion / (pageHeight - pageViewportHeight)) * 360;

  halfCircles.forEach((el) => {
    el.style.transform = `rotate(${scrolledPortionDegree}deg)`;

    if (scrolledPortionDegree >= 180) {
      halfCircles[0].style.transform = "rotate(180deg)";
      halfCircleTop.style.opacity = "0";
    } else {
      halfCircleTop.style.opacity = "1";
    }
  });

  scrollBool = scrolledPortion + pageViewportHeight === pageHeight;

  // Arrow Rotation
  if (scrollBool) {
    progressBarCircle.style.transform = "rotate(180deg)";
  } else {
    progressBarCircle.style.transform = "rotate(0)";
  }
  // End of Arrow Rotation
};

// Progress Bar Click
progressBar.addEventListener("click", (e) => {
  e.preventDefault();

  if (!imageWrapper) {
    const sectionPositions = Array.from(sections).map(
      (section) => scrolledPortion + section.getBoundingClientRect().top
    );

    const position = sectionPositions.find((sectionPosition) => {
      return sectionPosition > scrolledPortion;
    });

    scrollBool ? window.scrollTo(0, 0) : window.scrollTo(0, position);
  } else {
    scrollBool
      ? imageWrapper.scrollTo(0, 0)
      : imageWrapper.scrollTo(0, imageWrapper.scrollHeight);
  }
});
// End of Progress Bar Click

progressBarFn();

// End of Progress Bar

// Navigation
const menuIcon = document.querySelector(".menu-icon");
const navbar = document.querySelector(".navbar");

const scrollFn = () => {
  menuIcon.classList.add("show-menu-icon");
  navbar.classList.add("hide-navbar");

  if (window.scrollY === 0) {
    menuIcon.classList.remove("show-menu-icon");
    navbar.classList.remove("hide-navbar");
  }

  progressBarFn();
};

document.addEventListener("scroll", scrollFn);

menuIcon.addEventListener("click", () => {
  menuIcon.classList.remove("show-menu-icon");
  navbar.classList.remove("hide-navbar");
});
// End of Navigation

// About me text
const aboutMeText = document.querySelector(".about-me-text");
const aboutMeTextContent =
  "I am a designer and I like creating the most innovative and visually pleasing designs possible. I also like Purdue, guitar, and racing.";

Array.from(aboutMeTextContent).forEach((char) => {
  const span = document.createElement("span");
  span.textContent = char;
  aboutMeText.appendChild(span);

  span.addEventListener("mouseenter", (e) => {
    e.target.style.animation = "aboutMeTextAnim 10s infinite";
  });
});
// End of About me text

// section 4
document.querySelectorAll(".service-btn").forEach((service) => {
  service.addEventListener("click", (e) => {
    e.preventDefault();

    const serviceText = service.nextElementSibling;
    serviceText.classList.toggle("change");

    const rightPosition = serviceText.classList.contains("change")
      ? `calc(100% - ${getComputedStyle(service.firstElementChild).width})`
      : 0;

    service.firstElementChild.style.right = rightPosition;
  });
});
// End of section 4

// Section 5
// Form
const formHeading = document.querySelector(".form-heading");
const formInputs = document.querySelectorAll(".contact-form-input");

formInputs.forEach((input) => {
  input.addEventListener("focus", () => {
    formHeading.style.opacity = "0";
    setTimeout(() => {
      formHeading.textContent = `Your ${input.placeholder}`;
      formHeading.style.opacity = "1";
    }, 300);
  });

  input.addEventListener("blur", () => {
    formHeading.style.opacity = "0";
    setTimeout(() => {
      formHeading.textContent = "Let's Talk";
      formHeading.style.opacity = "1";
    }, 300);
  });
});
// End of Form

// Slideshow
const slideshow = document.querySelector(".slideshow");

setInterval(() => {
  const firstIcon = slideshow.firstElementChild;

  firstIcon.classList.add("faded-out");

  const thirdIcon = slideshow.children[3];

  thirdIcon.classList.add("light");

  thirdIcon.previousElementSibling.classList.remove("light");

  setTimeout(() => {
    slideshow.removeChild(firstIcon);

    slideshow.appendChild(firstIcon);

    setTimeout(() => {
      firstIcon.classList.remove("faded-out");
    }, 500);
  }, 500);
}, 3000);
// End of Slideshow

// Form Validation
const form = document.querySelector(".contact-form");
const username = document.getElementById("name");
const email = document.getElementById("email");
const subject = document.getElementById("subject");
const message = document.getElementById("message");
const messages = document.querySelectorAll(".message");

const error = (input, message) => {
  input.nextElementSibling.classList.add("error");
  input.nextElementSibling.textContent = message;
};

const success = (input) => {
  input.nextElementSibling.classList.remove("error");
};

const checkRequiredFields = (inputArr) => {
  inputArr.forEach((input) => {
    if (input.value.trim() === "") {
      error(input, `${input.id} is required`);
    }
  });
};

const checkLength = (input, min) => {
  if (input.value.trim().length < min) {
    error(input, `${input.id} must be at least ${min} characters`);
  } else {
    success(input);
  }
};

const checkEmail = (input) => {
  const regEx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (regEx.test(input.value.trim())) {
    success(input);
  } else {
    error(input, "Email is not valid");
  }
};

form.addEventListener("submit", (e) => {
  checkLength(username, 2);
  checkLength(subject, 2);
  checkLength(message, 10);
  checkEmail(email);
  checkRequiredFields([username, email, subject, message]);

  const notValid = Array.from(messages).find((message) => {
    return message.classList.contains("error");
  });

  notValid && e.preventDefault();
});
// End of Form Validation
// end of section 5
//
//
//
//
//
//
//
//

!(function (a, b) {
  "use strict";
  function c(a) {
    a = a || {};
    for (var b = 1; b < arguments.length; b++) {
      var c = arguments[b];
      if (c)
        for (var d in c)
          c.hasOwnProperty(d) &&
            ("object" == typeof c[d] ? deepExtend(a[d], c[d]) : (a[d] = c[d]));
    }
    return a;
  }
  function d(d, g) {
    function h() {
      if (y) {
        (r = b.createElement("canvas")),
          (r.className = "pg-canvas"),
          (r.style.display = "block"),
          d.insertBefore(r, d.firstChild),
          (s = r.getContext("2d")),
          i();
        for (
          var c = Math.round((r.width * r.height) / g.density), e = 0;
          c > e;
          e++
        ) {
          var f = new n();
          f.setStackPos(e), z.push(f);
        }
        a.addEventListener(
          "resize",
          function () {
            k();
          },
          !1
        ),
          b.addEventListener(
            "mousemove",
            function (a) {
              (A = a.pageX), (B = a.pageY);
            },
            !1
          ),
          D &&
            !C &&
            a.addEventListener(
              "deviceorientation",
              function () {
                (F = Math.min(Math.max(-event.beta, -30), 30)),
                  (E = Math.min(Math.max(-event.gamma, -30), 30));
              },
              !0
            ),
          j(),
          q("onInit");
      }
    }
    function i() {
      (r.width = d.offsetWidth),
        (r.height = d.offsetHeight),
        (s.fillStyle = g.dotColor),
        (s.strokeStyle = g.lineColor),
        (s.lineWidth = g.lineWidth);
    }
    function j() {
      if (y) {
        (u = a.innerWidth),
          (v = a.innerHeight),
          s.clearRect(0, 0, r.width, r.height);
        for (var b = 0; b < z.length; b++) z[b].updatePosition();
        for (var b = 0; b < z.length; b++) z[b].draw();
        G || (t = requestAnimationFrame(j));
      }
    }
    function k() {
      i();
      for (
        var a = d.offsetWidth, b = d.offsetHeight, c = z.length - 1;
        c >= 0;
        c--
      )
        (z[c].position.x > a || z[c].position.y > b) && z.splice(c, 1);
      var e = Math.round((r.width * r.height) / g.density);
      if (e > z.length)
        for (; e > z.length; ) {
          var f = new n();
          z.push(f);
        }
      else e < z.length && z.splice(e);
      for (c = z.length - 1; c >= 0; c--) z[c].setStackPos(c);
    }
    function l() {
      G = !0;
    }
    function m() {
      (G = !1), j();
    }
    function n() {
      switch (
        (this.stackPos,
        (this.active = !0),
        (this.layer = Math.ceil(3 * Math.random())),
        (this.parallaxOffsetX = 0),
        (this.parallaxOffsetY = 0),
        (this.position = {
          x: Math.ceil(Math.random() * r.width),
          y: Math.ceil(Math.random() * r.height),
        }),
        (this.speed = {}),
        g.directionX)
      ) {
        case "left":
          this.speed.x = +(
            -g.maxSpeedX +
            Math.random() * g.maxSpeedX -
            g.minSpeedX
          ).toFixed(2);
          break;
        case "right":
          this.speed.x = +(Math.random() * g.maxSpeedX + g.minSpeedX).toFixed(
            2
          );
          break;
        default:
          (this.speed.x = +(
            -g.maxSpeedX / 2 +
            Math.random() * g.maxSpeedX
          ).toFixed(2)),
            (this.speed.x += this.speed.x > 0 ? g.minSpeedX : -g.minSpeedX);
      }
      switch (g.directionY) {
        case "up":
          this.speed.y = +(
            -g.maxSpeedY +
            Math.random() * g.maxSpeedY -
            g.minSpeedY
          ).toFixed(2);
          break;
        case "down":
          this.speed.y = +(Math.random() * g.maxSpeedY + g.minSpeedY).toFixed(
            2
          );
          break;
        default:
          (this.speed.y = +(
            -g.maxSpeedY / 2 +
            Math.random() * g.maxSpeedY
          ).toFixed(2)),
            (this.speed.x += this.speed.y > 0 ? g.minSpeedY : -g.minSpeedY);
      }
    }
    function o(a, b) {
      return b ? void (g[a] = b) : g[a];
    }
    function p() {
      console.log("destroy"),
        r.parentNode.removeChild(r),
        q("onDestroy"),
        f && f(d).removeData("plugin_" + e);
    }
    function q(a) {
      void 0 !== g[a] && g[a].call(d);
    }
    var r,
      s,
      t,
      u,
      v,
      w,
      x,
      y = !!b.createElement("canvas").getContext,
      z = [],
      A = 0,
      B = 0,
      C = !navigator.userAgent.match(
        /(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i
      ),
      D = !!a.DeviceOrientationEvent,
      E = 0,
      F = 0,
      G = !1;
    return (
      (g = c({}, a[e].defaults, g)),
      (n.prototype.draw = function () {
        s.beginPath(),
          s.arc(
            this.position.x + this.parallaxOffsetX,
            this.position.y + this.parallaxOffsetY,
            g.particleRadius / 2,
            0,
            2 * Math.PI,
            !0
          ),
          s.closePath(),
          s.fill(),
          s.beginPath();
        for (var a = z.length - 1; a > this.stackPos; a--) {
          var b = z[a],
            c = this.position.x - b.position.x,
            d = this.position.y - b.position.y,
            e = Math.sqrt(c * c + d * d).toFixed(2);
          e < g.proximity &&
            (s.moveTo(
              this.position.x + this.parallaxOffsetX,
              this.position.y + this.parallaxOffsetY
            ),
            g.curvedLines
              ? s.quadraticCurveTo(
                  Math.max(b.position.x, b.position.x),
                  Math.min(b.position.y, b.position.y),
                  b.position.x + b.parallaxOffsetX,
                  b.position.y + b.parallaxOffsetY
                )
              : s.lineTo(
                  b.position.x + b.parallaxOffsetX,
                  b.position.y + b.parallaxOffsetY
                ));
        }
        s.stroke(), s.closePath();
      }),
      (n.prototype.updatePosition = function () {
        if (g.parallax) {
          if (D && !C) {
            var a = (u - 0) / 60;
            w = (E - -30) * a + 0;
            var b = (v - 0) / 60;
            x = (F - -30) * b + 0;
          } else (w = A), (x = B);
          (this.parallaxTargX =
            (w - u / 2) / (g.parallaxMultiplier * this.layer)),
            (this.parallaxOffsetX +=
              (this.parallaxTargX - this.parallaxOffsetX) / 10),
            (this.parallaxTargY =
              (x - v / 2) / (g.parallaxMultiplier * this.layer)),
            (this.parallaxOffsetY +=
              (this.parallaxTargY - this.parallaxOffsetY) / 10);
        }
        var c = d.offsetWidth,
          e = d.offsetHeight;
        switch (g.directionX) {
          case "left":
            this.position.x + this.speed.x + this.parallaxOffsetX < 0 &&
              (this.position.x = c - this.parallaxOffsetX);
            break;
          case "right":
            this.position.x + this.speed.x + this.parallaxOffsetX > c &&
              (this.position.x = 0 - this.parallaxOffsetX);
            break;
          default:
            (this.position.x + this.speed.x + this.parallaxOffsetX > c ||
              this.position.x + this.speed.x + this.parallaxOffsetX < 0) &&
              (this.speed.x = -this.speed.x);
        }
        switch (g.directionY) {
          case "up":
            this.position.y + this.speed.y + this.parallaxOffsetY < 0 &&
              (this.position.y = e - this.parallaxOffsetY);
            break;
          case "down":
            this.position.y + this.speed.y + this.parallaxOffsetY > e &&
              (this.position.y = 0 - this.parallaxOffsetY);
            break;
          default:
            (this.position.y + this.speed.y + this.parallaxOffsetY > e ||
              this.position.y + this.speed.y + this.parallaxOffsetY < 0) &&
              (this.speed.y = -this.speed.y);
        }
        (this.position.x += this.speed.x), (this.position.y += this.speed.y);
      }),
      (n.prototype.setStackPos = function (a) {
        this.stackPos = a;
      }),
      h(),
      { option: o, destroy: p, start: m, pause: l }
    );
  }
  var e = "particleground",
    f = a.jQuery;
  (a[e] = function (a, b) {
    return new d(a, b);
  }),
    (a[e].defaults = {
      minSpeedX: 0.1,
      maxSpeedX: 0.7,
      minSpeedY: 0.1,
      maxSpeedY: 0.7,
      directionX: "center",
      directionY: "center",
      density: 1e4,
      dotColor: "#666666",
      lineColor: "#666666",
      particleRadius: 7,
      lineWidth: 1,
      curvedLines: !1,
      proximity: 100,
      parallax: !0,
      parallaxMultiplier: 5,
      onInit: function () {},
      onDestroy: function () {},
    }),
    f &&
      (f.fn[e] = function (a) {
        if ("string" == typeof arguments[0]) {
          var b,
            c = arguments[0],
            g = Array.prototype.slice.call(arguments, 1);
          return (
            this.each(function () {
              f.data(this, "plugin_" + e) &&
                "function" == typeof f.data(this, "plugin_" + e)[c] &&
                (b = f.data(this, "plugin_" + e)[c].apply(this, g));
            }),
            void 0 !== b ? b : this
          );
        }
        return "object" != typeof a && a
          ? void 0
          : this.each(function () {
              f.data(this, "plugin_" + e) ||
                f.data(this, "plugin_" + e, new d(this, a));
            });
      });
})(window, document),
  (function () {
    for (
      var a = 0, b = ["ms", "moz", "webkit", "o"], c = 0;
      c < b.length && !window.requestAnimationFrame;
      ++c
    )
      (window.requestAnimationFrame = window[b[c] + "RequestAnimationFrame"]),
        (window.cancelAnimationFrame =
          window[b[c] + "CancelAnimationFrame"] ||
          window[b[c] + "CancelRequestAnimationFrame"]);
    window.requestAnimationFrame ||
      (window.requestAnimationFrame = function (b) {
        var c = new Date().getTime(),
          d = Math.max(0, 16 - (c - a)),
          e = window.setTimeout(function () {
            b(c + d);
          }, d);
        return (a = c + d), e;
      }),
      window.cancelAnimationFrame ||
        (window.cancelAnimationFrame = function (a) {
          clearTimeout(a);
        });
  })();
particleground(document.getElementById("particles-foreground"), {
  dotColor: "rgba(255, 255, 255, 1)",
  lineColor: "rgba(255, 255, 255, 0.05)",
  minSpeedX: 0.3,
  maxSpeedX: 0.6,
  minSpeedY: 0.3,
  maxSpeedY: 0.6,
  density: 50000, // One particle every n pixels
  curvedLines: false,
  proximity: 250, // How close two dots need to be before they join
  parallaxMultiplier: 10, // Lower the number is more extreme parallax
  particleRadius: 4, // Dot size
});
particleground(document.getElementById("particles-background"), {
  dotColor: "rgba(255, 255, 255, 0.5)",
  lineColor: "rgba(255, 255, 255, 0.05)",
  minSpeedX: 0.075,
  maxSpeedX: 0.15,
  minSpeedY: 0.075,
  maxSpeedY: 0.15,
  density: 30000, // One particle every n pixels
  curvedLines: false,
  proximity: 20, // How close two dots need to be before they join
  parallaxMultiplier: 20, // Lower the number is more extreme parallax
  particleRadius: 2, // Dot size
});
