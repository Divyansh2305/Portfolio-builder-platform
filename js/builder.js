document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       CONFIG
    ========================================================= */

    const API_BASE = "https://portfolio-builder-platform-3.onrender.com";


    /* =========================================================
       USER / AUTH STATE
    ========================================================= */

    let loggedInUser = null;
    let authToken = null;


    /* =========================================================
       HELPER
    ========================================================= */

    const $ = (id) => document.getElementById(id);


    function safeValue(element) {
        return element ? element.value.trim() : "";
    }


    function makeURL(url) {

        url = (url || "").trim();

        if (!url) {
            return "#";
        }

        if (
            url.startsWith("http://") ||
            url.startsWith("https://")
        ) {
            return url;
        }

        return "https://" + url;
    }


    /* =========================================================
       DOM ELEMENTS
    ========================================================= */

    const nameInput = $("name");
    const professionInput = $("profession");
    const aboutInput = $("about");
    const emailInput = $("email");
    const phoneInput = $("phone");
    const locationInput = $("location");
    const profileImageInput = $("profileImage");

    const skillsContainer = $("skillsContainer");
    const educationContainer = $("educationContainer");
    const projectsContainer = $("projectsContainer");
    const socialLinksContainer = $("socialLinksContainer");

    const addSkillBtn = $("addSkill");
    const addEducationBtn = $("addEducation");
    const addProjectBtn = $("addProject");
    const addSocialLinkBtn = $("addSocialLink");

    const saveBtn = $("saveBtn");
    const previewBtn = $("previewBtn");
    const generateBtn = $("generateBtn");

    const previewName = $("previewName");
    const previewProfession = $("previewProfession");
    const previewAbout = $("previewAbout");
    const previewEmail = $("previewEmail");
    const previewPhone = $("previewPhone");
    const previewLocation = $("previewLocation");
    const previewImage = $("previewImage");

    const previewSkills = $("previewSkills");
    const previewEducation = $("previewEducation");
    const previewProjects = $("previewProjects");

    const previewLinkedin = $("previewLinkedin");
    const previewGithub = $("previewGithub");
    const previewInstagram = $("previewInstagram");


    /* =========================================================
       AUTH TOKEN
    ========================================================= */

    function getAuthToken() {

        return (
            localStorage.getItem("token") ||
            sessionStorage.getItem("token") ||
            localStorage.getItem("authToken") ||
            sessionStorage.getItem("authToken") ||
            localStorage.getItem("accessToken") ||
            sessionStorage.getItem("accessToken") ||
            null
        );
    }


    function saveAuthToken(token) {

        if (!token) {
            return;
        }

        authToken = token;

        localStorage.setItem("token", token);
        sessionStorage.setItem("token", token);
    }


    function clearAuthToken() {

        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");

        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");

        localStorage.removeItem("user");
        sessionStorage.removeItem("user");

        authToken = null;
        loggedInUser = null;
    }


    /* =========================================================
       USER ID
    ========================================================= */

    function getUserId(user) {

        if (!user) {
            return null;
        }

        return (
            user._id ||
            user.id ||
            user.userId ||
            user.user_id ||
            null
        );
    }


    /* =========================================================
       EXTRACT USER
    ========================================================= */

    function extractUser(data) {

        if (!data) {
            return null;
        }

        if (data.user) {
            return data.user;
        }

        if (data.data && data.data.user) {
            return data.data.user;
        }

        if (data.data) {
            return data.data;
        }

        if (
            data._id ||
            data.id ||
            data.email ||
            data.name
        ) {
            return data;
        }

        return null;
    }


    /* =========================================================
       API REQUEST
    ========================================================= */

    async function apiRequest(endpoint, options = {}) {

        authToken = getAuthToken();

        const headers = {
            ...(options.headers || {})
        };


        if (authToken) {

            headers.Authorization =
                `Bearer ${authToken}`;
        }


        const response = await fetch(
            `${API_BASE}${endpoint}`,
            {
                ...options,
                headers
            }
        );


        let data = {};

        const contentType =
            response.headers.get("content-type") || "";


        if (contentType.includes("application/json")) {

            try {
                data = await response.json();
            } catch (error) {
                data = {};
            }

        } else {

            try {

                const text =
                    await response.text();

                data = {
                    message: text
                };

            } catch (error) {

                data = {};
            }
        }


        return {
            response,
            data
        };
    }


    /* =========================================================
       PERSONAL PREVIEW
    ========================================================= */

    function updatePersonalPreview() {

        if (previewName) {

            previewName.textContent =
                safeValue(nameInput) ||
                "Your Name";
        }


        if (previewProfession) {

            previewProfession.textContent =
                safeValue(professionInput) ||
                "Your Profession";
        }


        if (previewAbout) {

            previewAbout.textContent =
                safeValue(aboutInput) ||
                "Your introduction will appear here.";
        }


        if (previewEmail) {

            previewEmail.textContent =
                safeValue(emailInput) ||
                "email@example.com";
        }


        if (previewPhone) {

            previewPhone.textContent =
                safeValue(phoneInput) ||
                "+91 XXXXX XXXXX";
        }


        if (previewLocation) {

            previewLocation.textContent =
                safeValue(locationInput) ||
                "India";
        }
    }


    /* =========================================================
       PROFILE IMAGE
    ========================================================= */

    if (profileImageInput) {

        profileImageInput.addEventListener(
            "change",
            function () {

                const file =
                    this.files &&
                    this.files[0];


                if (!file) {
                    return;
                }


                if (!file.type.startsWith("image/")) {

                    alert(
                        "Please select a valid image file."
                    );

                    this.value = "";

                    return;
                }


                if (file.size > 5 * 1024 * 1024) {

                    alert(
                        "Image size 5MB se kam honi chahiye."
                    );

                    this.value = "";

                    return;
                }


                const reader =
                    new FileReader();


                reader.onload = function (event) {

                    if (previewImage) {

                        previewImage.src =
                            event.target.result;
                    }
                };


                reader.readAsDataURL(file);
            }
        );
    }


    /* =========================================================
       SKILLS
    ========================================================= */

    function getSkills() {

        const skills = [];

        if (!skillsContainer) {
            return skills;
        }


        skillsContainer
            .querySelectorAll(".skill")
            .forEach(input => {

                const value =
                    input.value.trim();

                if (value) {
                    skills.push(value);
                }
            });


        return skills;
    }


    function updateSkillsPreview() {

        if (!previewSkills) {
            return;
        }


        previewSkills.innerHTML = "";


        let skills = getSkills();


        if (!skills.length) {

            skills = [
                "HTML",
                "CSS"
            ];
        }


        skills.forEach(skill => {

            const li =
                document.createElement("li");

            li.textContent = skill;

            previewSkills.appendChild(li);
        });
    }


    function setupSkillRow(row) {

        if (!row) {
            return;
        }


        const input =
            row.querySelector(".skill");


        const removeBtn =
            row.querySelector(".remove-skill");


        if (input) {

            input.addEventListener(
                "input",
                updateSkillsPreview
            );
        }


        if (removeBtn) {

            removeBtn.addEventListener(
                "click",
                () => {

                    row.remove();

                    updateSkillsPreview();
                }
            );
        }
    }


    function createSkillInput(value = "") {

        if (!skillsContainer) {
            return;
        }


        const row =
            document.createElement("div");


        row.className =
            "skill-input-row";


        row.innerHTML = `
            <input
                type="text"
                class="skill"
                placeholder="e.g. JavaScript"
            >

            <button
                type="button"
                class="remove-skill"
            >
                <i class="fa-solid fa-trash"></i>
            </button>
        `;


        const input =
            row.querySelector(".skill");


        if (input) {
            input.value = value;
        }


        skillsContainer.appendChild(row);

        setupSkillRow(row);

        updateSkillsPreview();
    }


    if (skillsContainer) {

        skillsContainer
            .querySelectorAll(".skill-input-row")
            .forEach(setupSkillRow);
    }


    if (addSkillBtn) {

        addSkillBtn.addEventListener(
            "click",
            () => {

                createSkillInput();

                const inputs =
                    skillsContainer
                        ? skillsContainer.querySelectorAll(".skill")
                        : [];


                if (inputs.length) {

                    inputs[inputs.length - 1].focus();
                }
            }
        );
    }


    /* =========================================================
       EDUCATION
    ========================================================= */

    function getEducation() {

        const education = [];

        if (!educationContainer) {
            return education;
        }


        educationContainer
            .querySelectorAll(".education-card")
            .forEach(card => {

                const college =
                    card.querySelector(
                        ".education-college"
                    )?.value.trim() || "";


                const degree =
                    card.querySelector(
                        ".education-degree"
                    )?.value.trim() || "";


                const year =
                    card.querySelector(
                        ".education-year"
                    )?.value.trim() || "";


                if (college || degree || year) {

                    education.push({
                        college,
                        degree,
                        year
                    });
                }
            });


        return education;
    }


    function updateEducationPreview() {

        if (!educationContainer) {
            return;
        }


        const cards =
            educationContainer.querySelectorAll(
                ".education-card"
            );


        const previewDegree =
            $("previewDegree");

        const previewCollege =
            $("previewCollege");

        const previewYear =
            $("previewYear");


        document
            .querySelectorAll(
                ".education-preview-extra"
            )
            .forEach(item => item.remove());


        if (!cards.length) {

            if (previewDegree) {
                previewDegree.textContent = "Degree";
            }

            if (previewCollege) {
                previewCollege.textContent =
                    "College / University";
            }

            if (previewYear) {
                previewYear.textContent =
                    "Passing Year";
            }

            return;
        }


        const firstCard = cards[0];


        const degree =
            firstCard.querySelector(
                ".education-degree"
            )?.value.trim() || "";


        const college =
            firstCard.querySelector(
                ".education-college"
            )?.value.trim() || "";


        const year =
            firstCard.querySelector(
                ".education-year"
            )?.value.trim() || "";


        if (previewDegree) {
            previewDegree.textContent =
                degree || "Degree";
        }


        if (previewCollege) {
            previewCollege.textContent =
                college || "College / University";
        }


        if (previewYear) {
            previewYear.textContent =
                year || "Passing Year";
        }


        if (!previewEducation) {
            return;
        }


        for (let i = 1; i < cards.length; i++) {

            const card = cards[i];


            const cardDegree =
                card.querySelector(
                    ".education-degree"
                )?.value.trim() || "";


            const cardCollege =
                card.querySelector(
                    ".education-college"
                )?.value.trim() || "";


            const cardYear =
                card.querySelector(
                    ".education-year"
                )?.value.trim() || "";


            if (!cardDegree && !cardCollege && !cardYear) {
                continue;
            }


            const extra =
                document.createElement("div");


            extra.className =
                "education-preview education-preview-extra";


            const h3 =
                document.createElement("h3");

            h3.textContent =
                cardDegree || "Degree";


            const p =
                document.createElement("p");

            p.textContent =
                cardCollege || "College / University";


            const span =
                document.createElement("span");

            span.textContent =
                cardYear || "Passing Year";


            extra.appendChild(h3);
            extra.appendChild(p);
            extra.appendChild(span);


            previewEducation.appendChild(extra);
        }
    }


    function setupEducationCard(card) {

        if (!card) {
            return;
        }


        card
            .querySelectorAll("input")
            .forEach(input => {

                input.addEventListener(
                    "input",
                    updateEducationPreview
                );
            });


        const removeBtn =
            card.querySelector(".remove-education");


        if (removeBtn) {

            removeBtn.addEventListener(
                "click",
                () => {

                    card.remove();

                    updateEducationPreview();
                }
            );
        }
    }


    if (educationContainer) {

        educationContainer
            .querySelectorAll(".education-card")
            .forEach(setupEducationCard);
    }


    function createEducationCard(education = {}) {

        if (!educationContainer) {
            return;
        }


        const card =
            document.createElement("div");


        card.className =
            "education-card";


        card.innerHTML = `
            <button
                type="button"
                class="remove-education"
            >
                <i class="fa-solid fa-trash"></i>
            </button>

            <div class="form-group">
                <label>College / University</label>

                <input
                    type="text"
                    class="education-college"
                    placeholder="University / College Name"
                >
            </div>

            <div class="form-group">
                <label>Degree</label>

                <input
                    type="text"
                    class="education-degree"
                    placeholder="e.g. MCA"
                >
            </div>

            <div class="form-group">
                <label>Passing Year</label>

                <input
                    type="text"
                    class="education-year"
                    placeholder="2026"
                >
            </div>
        `;


        card.querySelector(".education-college").value =
            education.college || "";


        card.querySelector(".education-degree").value =
            education.degree || "";


        card.querySelector(".education-year").value =
            education.year || "";


        educationContainer.appendChild(card);

        setupEducationCard(card);

        updateEducationPreview();
    }


    if (addEducationBtn) {

        addEducationBtn.addEventListener(
            "click",
            () => {
                createEducationCard();
            }
        );
    }


    /* =========================================================
       PROJECTS
    ========================================================= */

    function getProjects() {

        const projects = [];

        if (!projectsContainer) {
            return projects;
        }


        projectsContainer
            .querySelectorAll(".project-card-builder")
            .forEach(card => {

                const name =
                    card.querySelector(
                        ".project-name"
                    )?.value.trim() || "";


                const description =
                    card.querySelector(
                        ".project-description"
                    )?.value.trim() || "";


                const github =
                    card.querySelector(
                        ".project-github"
                    )?.value.trim() || "";


                const live =
                    card.querySelector(
                        ".project-live"
                    )?.value.trim() || "";


                if (name || description || github || live) {

                    projects.push({
                        name,
                        description,
                        github,
                        live
                    });
                }
            });


        return projects;
    }


    function updateProjectPreview() {

        if (!projectsContainer || !previewProjects) {
            return;
        }


        const cards =
            projectsContainer.querySelectorAll(
                ".project-card-builder"
            );


        const previewProjectName =
            $("previewProjectName");

        const previewProjectDescription =
            $("previewProjectDescription");

        const previewProjectGithub =
            $("previewProjectGithub");

        const previewProjectLive =
            $("previewProjectLive");


        previewProjects
            .querySelectorAll(".project-preview-extra")
            .forEach(item => item.remove());


        if (!cards.length) {

            if (previewProjectName) {
                previewProjectName.textContent =
                    "Project Name";
            }

            if (previewProjectDescription) {
                previewProjectDescription.textContent =
                    "Project description will appear here.";
            }

            if (previewProjectGithub) {
                previewProjectGithub.href = "#";
                previewProjectGithub.style.display = "none";
            }

            if (previewProjectLive) {
                previewProjectLive.href = "#";
                previewProjectLive.style.display = "none";
            }

            return;
        }


        const firstCard = cards[0];


        const firstName =
            firstCard.querySelector(
                ".project-name"
            )?.value.trim() || "";


        const firstDescription =
            firstCard.querySelector(
                ".project-description"
            )?.value.trim() || "";


        const firstGithub =
            firstCard.querySelector(
                ".project-github"
            )?.value.trim() || "";


        const firstLive =
            firstCard.querySelector(
                ".project-live"
            )?.value.trim() || "";


        if (previewProjectName) {

            previewProjectName.textContent =
                firstName || "Project Name";
        }


        if (previewProjectDescription) {

            previewProjectDescription.textContent =
                firstDescription ||
                "Project description will appear here.";
        }


        if (previewProjectGithub) {

            if (firstGithub) {

                previewProjectGithub.href =
                    makeURL(firstGithub);

                previewProjectGithub.target = "_blank";

                previewProjectGithub.rel =
                    "noopener noreferrer";

                previewProjectGithub.style.display =
                    "inline-flex";

            } else {

                previewProjectGithub.style.display =
                    "none";
            }
        }


        if (previewProjectLive) {

            if (firstLive) {

                previewProjectLive.href =
                    makeURL(firstLive);

                previewProjectLive.target = "_blank";

                previewProjectLive.rel =
                    "noopener noreferrer";

                previewProjectLive.style.display =
                    "inline-flex";

            } else {

                previewProjectLive.style.display =
                    "none";
            }
        }


        for (let i = 1; i < cards.length; i++) {

            const card = cards[i];


            const name =
                card.querySelector(
                    ".project-name"
                )?.value.trim() || "";


            const description =
                card.querySelector(
                    ".project-description"
                )?.value.trim() || "";


            const github =
                card.querySelector(
                    ".project-github"
                )?.value.trim() || "";


            const live =
                card.querySelector(
                    ".project-live"
                )?.value.trim() || "";


            if (!name && !description && !github && !live) {
                continue;
            }


            const extra =
                document.createElement("div");


            extra.className =
                "project-preview project-preview-extra";


            const title =
                document.createElement("h3");

            title.textContent =
                name || "Project Name";


            const desc =
                document.createElement("p");

            desc.textContent =
                description ||
                "Project description will appear here.";


            extra.appendChild(title);
            extra.appendChild(desc);


            if (github || live) {

                const links =
                    document.createElement("div");

                links.className =
                    "project-links";


                if (github) {

                    const githubLink =
                        document.createElement("a");

                    githubLink.href =
                        makeURL(github);

                    githubLink.target = "_blank";

                    githubLink.rel =
                        "noopener noreferrer";

                    githubLink.innerHTML = `
                        <i class="fa-brands fa-github"></i>
                        GitHub
                    `;

                    links.appendChild(githubLink);
                }


                if (live) {

                    const liveLink =
                        document.createElement("a");

                    liveLink.href =
                        makeURL(live);

                    liveLink.target = "_blank";

                    liveLink.rel =
                        "noopener noreferrer";

                    liveLink.innerHTML = `
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        Live Demo
                    `;

                    links.appendChild(liveLink);
                }


                extra.appendChild(links);
            }


            previewProjects.appendChild(extra);
        }
    }


    function setupProjectCard(card) {

        if (!card) {
            return;
        }


        card
            .querySelectorAll("input, textarea")
            .forEach(input => {

                input.addEventListener(
                    "input",
                    updateProjectPreview
                );
            });


        const removeBtn =
            card.querySelector(".remove-project");


        if (removeBtn) {

            removeBtn.addEventListener(
                "click",
                () => {

                    card.remove();

                    updateProjectPreview();
                }
            );
        }
    }


    if (projectsContainer) {

        projectsContainer
            .querySelectorAll(".project-card-builder")
            .forEach(setupProjectCard);
    }


    function createProjectCard(project = {}) {

        if (!projectsContainer) {
            return;
        }


        const card =
            document.createElement("div");


        card.className =
            "project-card-builder";


        card.innerHTML = `
            <button
                type="button"
                class="remove-project"
            >
                <i class="fa-solid fa-trash"></i>
            </button>

            <div class="form-group">
                <label>Project Name</label>

                <input
                    type="text"
                    class="project-name"
                    placeholder="e.g. Amazon Clone"
                >
            </div>

            <div class="form-group">
                <label>Project Description</label>

                <textarea
                    class="project-description"
                    rows="3"
                    placeholder="Describe your project..."
                ></textarea>
            </div>

            <div class="form-group">
                <label>GitHub Link</label>

                <input
                    type="url"
                    class="project-github"
                    placeholder="https://github.com/..."
                >
            </div>

            <div class="form-group">
                <label>Live Demo</label>

                <input
                    type="url"
                    class="project-live"
                    placeholder="https://..."
                >
            </div>
        `;


        card.querySelector(".project-name").value =
            project.name || "";


        card.querySelector(".project-description").value =
            project.description || "";


        card.querySelector(".project-github").value =
            project.github || "";


        card.querySelector(".project-live").value =
            project.live || "";


        projectsContainer.appendChild(card);

        setupProjectCard(card);

        updateProjectPreview();
    }


    if (addProjectBtn) {

        addProjectBtn.addEventListener(
            "click",
            () => {
                createProjectCard();
            }
        );
    }


    /* =========================================================
       SOCIAL LINKS
    ========================================================= */

    function getSocialLinks() {

        const social = [];

        if (!socialLinksContainer) {
            return social;
        }


        socialLinksContainer
            .querySelectorAll(".social-link-card")
            .forEach(card => {

                const platform =
                    card.querySelector(
                        ".social-platform"
                    )?.value || "";


                const url =
                    card.querySelector(
                        ".social-url"
                    )?.value.trim() || "";


                if (url) {

                    social.push({
                        platform,
                        url
                    });
                }
            });


        return social;
    }


    function updateSocialLinks() {

        if (!socialLinksContainer) {
            return;
        }


        [
            previewLinkedin,
            previewGithub,
            previewInstagram
        ].forEach(link => {

            if (link) {
                link.style.display = "none";
            }
        });


        socialLinksContainer
            .querySelectorAll(".social-link-card")
            .forEach(card => {

                const platform =
                    card.querySelector(
                        ".social-platform"
                    );


                const urlInput =
                    card.querySelector(
                        ".social-url"
                    );


                if (!platform || !urlInput) {
                    return;
                }


                const platformValue =
                    platform.value;


                const url =
                    urlInput.value.trim();


                if (!url) {
                    return;
                }


                let previewLink = null;


                if (platformValue === "linkedin") {

                    previewLink =
                        previewLinkedin;

                } else if (platformValue === "github") {

                    previewLink =
                        previewGithub;

                } else if (platformValue === "instagram") {

                    previewLink =
                        previewInstagram;
                }


                if (previewLink) {

                    previewLink.href =
                        makeURL(url);

                    previewLink.target = "_blank";

                    previewLink.rel =
                        "noopener noreferrer";

                    previewLink.style.display =
                        "inline-flex";
                }
            });
    }


    function setupSocialCard(card) {

        if (!card) {
            return;
        }


        card
            .querySelectorAll("input, select")
            .forEach(element => {

                element.addEventListener(
                    "input",
                    updateSocialLinks
                );

                element.addEventListener(
                    "change",
                    updateSocialLinks
                );
            });


        const removeBtn =
            card.querySelector(".remove-social");


        if (removeBtn) {

            removeBtn.addEventListener(
                "click",
                () => {

                    card.remove();

                    updateSocialLinks();
                }
            );
        }
    }


    if (socialLinksContainer) {

        socialLinksContainer
            .querySelectorAll(".social-link-card")
            .forEach(setupSocialCard);
    }


    function createSocialCard(social = {}) {

        if (!socialLinksContainer) {
            return;
        }


        const card =
            document.createElement("div");


        card.className =
            "social-link-card";


        card.innerHTML = `
            <button
                type="button"
                class="remove-social"
            >
                <i class="fa-solid fa-trash"></i>
            </button>

            <div class="form-group">
                <label>Platform</label>

                <select class="social-platform">
                    <option value="linkedin">LinkedIn</option>
                    <option value="github">GitHub</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter / X</option>
                    <option value="facebook">Facebook</option>
                </select>
            </div>

            <div class="form-group">
                <label>Profile URL</label>

                <input
                    type="url"
                    class="social-url"
                    placeholder="https://..."
                >
            </div>
        `;


        card.querySelector(".social-platform").value =
            social.platform || "linkedin";


        card.querySelector(".social-url").value =
            social.url || "";


        socialLinksContainer.appendChild(card);

        setupSocialCard(card);

        updateSocialLinks();
    }


    if (addSocialLinkBtn) {

        addSocialLinkBtn.addEventListener(
            "click",
            () => {
                createSocialCard();
            }
        );
    }


    /* =========================================================
       COLLECT PORTFOLIO DATA
    ========================================================= */

    function collectData() {

        return {

            name:
                safeValue(nameInput),

            profession:
                safeValue(professionInput),

            about:
                safeValue(aboutInput),

            email:
                safeValue(emailInput),

            phone:
                safeValue(phoneInput),

            location:
                safeValue(locationInput),

            skills:
                getSkills(),

            education:
                getEducation(),

            projects:
                getProjects(),

            socialLinks:
                getSocialLinks()
        };
    }


    /* =========================================================
       LOAD LOGGED-IN USER
    ========================================================= */

    async function loadLoggedInUser() {

        authToken = getAuthToken();


        if (!authToken) {

            console.warn(
                "No authentication token found."
            );

            return false;
        }


        try {

            const {
                response,
                data
            } = await apiRequest(
                "/api/auth/me",
                {
                    method: "GET"
                }
            );


            console.log(
                "Auth /me Response:",
                data
            );


            if (!response.ok) {

                console.error(
                    "Auth verification failed:",
                    data
                );

                clearAuthToken();

                return false;
            }


            const user =
                extractUser(data);


            if (!user) {

                console.error(
                    "User data not found:",
                    data
                );

                return false;
            }


            loggedInUser =
                user;


            const userId =
                getUserId(loggedInUser);


            console.log(
                "Logged-in User:",
                loggedInUser
            );


            console.log(
                "Logged-in User ID:",
                userId
            );


            if (!userId) {

                console.error(
                    "User ID not found.",
                    loggedInUser
                );

                return false;
            }


            if (
                emailInput &&
                !emailInput.value
            ) {

                emailInput.value =
                    loggedInUser.email || "";
            }


            if (
                nameInput &&
                !nameInput.value
            ) {

                nameInput.value =
                    loggedInUser.name || "";
            }


            localStorage.setItem(
                "user",
                JSON.stringify(loggedInUser)
            );


            updateAllPreview();


            return true;


        } catch (error) {

            console.error(
                "Load User Error:",
                error
            );

            return false;
        }
    }


    /* =========================================================
       LOAD PORTFOLIO
    ========================================================= */

    async function loadPortfolio() {

        authToken = getAuthToken();


        if (!authToken) {

            window.location.href =
                "login.html";

            return;
        }


        const userLoaded =
            await loadLoggedInUser();


        if (!userLoaded) {

            alert(
                "Login session invalid. Please login again."
            );

            window.location.href =
                "login.html";

            return;
        }


        try {

            const {
                response,
                data
            } = await apiRequest(
                "/api/portfolio/me",
                {
                    method: "GET"
                }
            );


            console.log(
                "Portfolio Response:",
                data
            );


            if (response.status === 404) {

                console.log(
                    "No portfolio found. Creating new portfolio."
                );

                updateAllPreview();

                return;
            }


            if (!response.ok) {

                if (response.status === 401) {

                    clearAuthToken();

                    alert(
                        "Session expired. Please login again."
                    );

                    window.location.href =
                        "login.html";

                    return;
                }


                throw new Error(
                    data.message ||
                    "Portfolio load failed."
                );
            }


            const portfolio =
                data.portfolio ||
                data.data?.portfolio ||
                data.data ||
                null;


            if (!portfolio) {

                updateAllPreview();

                return;
            }


            /* =================================================
               PERSONAL INFORMATION
            ================================================= */

            if (nameInput) {

                nameInput.value =
                    portfolio.name ||
                    loggedInUser?.name ||
                    "";
            }


            if (professionInput) {

                professionInput.value =
                    portfolio.profession || "";
            }


            if (aboutInput) {

                aboutInput.value =
                    portfolio.about || "";
            }


            if (emailInput) {

                emailInput.value =
                    portfolio.email ||
                    loggedInUser?.email ||
                    "";
            }


            if (phoneInput) {

                phoneInput.value =
                    portfolio.phone || "";
            }


            if (locationInput) {

                locationInput.value =
                    portfolio.location || "";
            }


            /* =================================================
               SKILLS
            ================================================= */

            if (skillsContainer) {

                skillsContainer.innerHTML = "";

                if (
                    Array.isArray(portfolio.skills)
                ) {

                    portfolio.skills.forEach(
                        skill => {

                            createSkillInput(skill);
                        }
                    );
                }
            }


            /* =================================================
               EDUCATION
            ================================================= */

            if (educationContainer) {

                educationContainer.innerHTML = "";

                if (
                    Array.isArray(portfolio.education)
                ) {

                    portfolio.education.forEach(
                        education => {

                            createEducationCard(
                                education
                            );
                        }
                    );
                }
            }


            /* =================================================
               PROJECTS
            ================================================= */

            if (projectsContainer) {

                projectsContainer.innerHTML = "";

                if (
                    Array.isArray(portfolio.projects)
                ) {

                    portfolio.projects.forEach(
                        project => {

                            createProjectCard(
                                project
                            );
                        }
                    );
                }
            }


            /* =================================================
               SOCIAL LINKS
            ================================================= */

            if (socialLinksContainer) {

                socialLinksContainer.innerHTML = "";

                if (
                    Array.isArray(
                        portfolio.socialLinks
                    )
                ) {

                    portfolio.socialLinks.forEach(
                        social => {

                            createSocialCard(
                                social
                            );
                        }
                    );
                }
            }


            /* =================================================
               PROFILE IMAGE
            ================================================= */

            const imageUrl =
                portfolio.profileImage ||
                portfolio.profileImageUrl ||
                portfolio.image ||
                "";


            if (imageUrl && previewImage) {

                if (
                    imageUrl.startsWith("http")
                ) {

                    previewImage.src =
                        imageUrl;

                } else {

                    previewImage.src =
                        `${API_BASE}${imageUrl}`;
                }
            }


            updateAllPreview();


            console.log(
                "Portfolio loaded successfully."
            );


        } catch (error) {

            console.error(
                "Portfolio Load Error:",
                error
            );

            showMessage(
                "Portfolio load nahi ho paaya."
            );
        }
    }


    /* =========================================================
       SAVE PORTFOLIO
    ========================================================= */

    async function savePortfolio() {

        authToken = getAuthToken();


        if (!authToken) {

            alert(
                "Please login first."
            );

            window.location.href =
                "login.html";

            return;
        }


        if (!loggedInUser) {

            const userLoaded =
                await loadLoggedInUser();


            if (!userLoaded) {

                alert(
                    "Login session verify nahi ho paayi."
                );

                return;
            }
        }


        const userId =
            getUserId(loggedInUser);


        if (!userId) {

            alert(
                "User ID nahi mili. Please login again."
            );

            return;
        }


        const portfolioData =
            collectData();


        console.log(
            "Saving Portfolio..."
        );


        console.log(
            "Logged-in User:",
            loggedInUser
        );


        console.log(
            "User ID:",
            userId
        );


        const originalHTML =
            saveBtn
                ? saveBtn.innerHTML
                : "";


        try {

            const formData =
                new FormData();


            formData.append(
                "name",
                portfolioData.name
            );


            formData.append(
                "profession",
                portfolioData.profession
            );


            formData.append(
                "about",
                portfolioData.about
            );


            formData.append(
                "email",
                portfolioData.email
            );


            formData.append(
                "phone",
                portfolioData.phone
            );


            formData.append(
                "location",
                portfolioData.location
            );


            formData.append(
                "skills",
                JSON.stringify(
                    portfolioData.skills
                )
            );


            formData.append(
                "education",
                JSON.stringify(
                    portfolioData.education
                )
            );


            formData.append(
                "projects",
                JSON.stringify(
                    portfolioData.projects
                )
            );


            formData.append(
                "socialLinks",
                JSON.stringify(
                    portfolioData.socialLinks
                )
            );


            if (
                profileImageInput &&
                profileImageInput.files &&
                profileImageInput.files[0]
            ) {

                formData.append(
                    "profileImage",
                    profileImageInput.files[0]
                );
            }


            if (saveBtn) {

                saveBtn.disabled = true;

                saveBtn.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Saving...
                `;
            }


            const {
                response,
                data
            } = await apiRequest(
                "/api/portfolio/save",
                {
                    method: "POST",
                    body: formData
                }
            );


            console.log(
                "Portfolio Save Response:",
                data
            );


            if (!response.ok) {

                if (response.status === 401) {

                    clearAuthToken();

                    alert(
                        "Session expired. Please login again."
                    );

                    window.location.href =
                        "login.html";

                    return;
                }


                throw new Error(
                    data.message ||
                    `Server error (${response.status})`
                );
            }


            if (saveBtn) {

                saveBtn.innerHTML = `
                    <i class="fa-solid fa-check"></i>
                    Saved
                `;
            }


            showMessage(
                "✓ Portfolio successfully saved!"
            );


            console.log(
                "Portfolio ID:",
                data?.portfolio?._id
            );


        } catch (error) {

            console.error(
                "Portfolio Save Error:",
                error
            );


            alert(
                "Portfolio save nahi hua ❌\n\n" +
                error.message
            );


        } finally {

            if (saveBtn) {

                saveBtn.disabled = false;


                setTimeout(() => {

                    saveBtn.innerHTML =
                        originalHTML;

                }, 1500);
            }
        }
    }


    /* =========================================================
       SAVE BUTTON
    ========================================================= */

    if (saveBtn) {

        saveBtn.addEventListener(
            "click",
            savePortfolio
        );
    }


    /* =========================================================
       PREVIEW BUTTON
    ========================================================= */

    if (previewBtn) {

        previewBtn.addEventListener(
            "click",
            () => {

                updateAllPreview();


                const previewArea =
                    document.querySelector(
                        ".preview-area"
                    );


                if (previewArea) {

                    previewArea.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }


                showMessage(
                    "✓ Preview updated"
                );
            }
        );
    }


    /* =========================================================
       PDF GENERATION
    ========================================================= */

    if (generateBtn) {

        generateBtn.addEventListener(
            "click",
            async () => {

                const portfolio =
                    document.querySelector(
                        ".portfolio-preview"
                    );


                if (!portfolio) {

                    alert(
                        "Portfolio preview nahi mila!"
                    );

                    return;
                }


                if (
                    typeof html2pdf ===
                    "undefined"
                ) {

                    alert(
                        "PDF library load nahi hui."
                    );

                    return;
                }


                updateAllPreview();


                const oldContent =
                    generateBtn.innerHTML;


                generateBtn.disabled =
                    true;


                generateBtn.innerHTML = `
                    <i class="fas fa-spinner fa-spin"></i>
                    Generating...
                `;


                const options = {

                    margin: 0,

                    filename:
                        "My_Portfolio.pdf",

                    image: {
                        type: "jpeg",
                        quality: 0.98
                    },

                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: "#ffffff",
                        logging: false
                    },

                    jsPDF: {
                        unit: "mm",
                        format: "a4",
                        orientation: "portrait"
                    },

                    pagebreak: {
                        mode: [
                            "avoid-all",
                            "css",
                            "legacy"
                        ]
                    }
                };


                try {

                    await html2pdf()
                        .set(options)
                        .from(portfolio)
                        .save();


                    generateBtn.innerHTML = `
                        <i class="fas fa-check"></i>
                        Downloaded
                    `;


                    showMessage(
                        "✓ PDF downloaded successfully"
                    );


                } catch (error) {

                    console.error(
                        "PDF Error:",
                        error
                    );


                    alert(
                        "PDF generate nahi ho paaya.\n\n" +
                        error.message
                    );


                } finally {

                    setTimeout(() => {

                        generateBtn.innerHTML =
                            oldContent;

                        generateBtn.disabled =
                            false;

                    }, 1500);
                }
            }
        );
    }


    /* =========================================================
       UPDATE ALL PREVIEW
    ========================================================= */

    function updateAllPreview() {

        updatePersonalPreview();

        updateSkillsPreview();

        updateEducationPreview();

        updateProjectPreview();

        updateSocialLinks();
    }


    /* =========================================================
       LIVE PREVIEW
    ========================================================= */

    document
        .querySelectorAll(
            ".builder-sidebar input, " +
            ".builder-sidebar textarea, " +
            ".builder-sidebar select"
        )
        .forEach(element => {

            element.addEventListener(
                "input",
                updateAllPreview
            );

            element.addEventListener(
                "change",
                updateAllPreview
            );
        });


    /* =========================================================
       MESSAGE
    ========================================================= */

    function showMessage(message) {

        const old =
            document.querySelector(
                ".builder-message"
            );


        if (old) {
            old.remove();
        }


        const box =
            document.createElement("div");


        box.className =
            "builder-message";


        box.textContent =
            message;


        box.style.position =
            "fixed";

        box.style.right =
            "25px";

        box.style.bottom =
            "25px";

        box.style.padding =
            "12px 18px";

        box.style.background =
            "#111827";

        box.style.color =
            "#ffffff";

        box.style.borderRadius =
            "8px";

        box.style.fontSize =
            "13px";

        box.style.fontWeight =
            "600";

        box.style.zIndex =
            "99999";

        box.style.boxShadow =
            "0 8px 25px rgba(0,0,0,0.15)";


        document.body.appendChild(box);


        setTimeout(() => {

            if (box) {
                box.remove();
            }

        }, 2500);
    }


    /* =========================================================
       INITIALIZE
    ========================================================= */

    updateAllPreview();


    console.log(
        "================================="
    );

    console.log(
        "Portfolio Builder Started"
    );

    console.log(
        "================================="
    );


    authToken =
        getAuthToken();


    console.log(
        "Token found:",
        !!authToken
    );


   if (authToken) {
    // Reload par saved portfolio ko form me load nahi karna hai.
    // MongoDB ka data database me safe rahega.
    updateAllPreview();
} else {

        console.warn(
            "No token found. Redirecting to login..."
        );

        window.location.href =
            "login.html";
    }

});